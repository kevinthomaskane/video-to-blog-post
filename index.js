#!/usr/bin/env node

import { config } from 'dotenv';
import OpenAI from 'openai';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Blog post metadata interface (JSDoc for TypeScript-like documentation)
/**
 * @typedef {Object} BlogPost
 * @property {string} slug - URL-friendly identifier
 * @property {string} title - Blog post title
 * @property {string} description - Blog post description
 * @property {string} author - Author name
 * @property {string} date - Publication date (YYYY-MM-DD)
 * @property {string} readTime - Estimated reading time
 * @property {string} [image] - Optional image path
 */

class VideoToMarkdown {
  constructor(outputDir = null) {
    this.outputDir = outputDir || path.join(__dirname, 'output');
  }

  async processVideo(videoPath) {
    try {
      console.log('🚀 Starting video processing...');

      // Validate input
      if (!(await fs.pathExists(videoPath))) {
        throw new Error(`Video file not found: ${videoPath}`);
      }

      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }

      // Get video name without extension for reference
      const videoName = path.basename(videoPath, path.extname(videoPath));

      // Step 2: Transcribe video using OpenAI Whisper
      const transcript = await this.transcribeVideo(videoPath);
      console.log(
        `📝 Transcription completed (${transcript.length} characters)`
      );

      // Step 3: Generate blog post content
      const blogContent = await this.generateBlogPost(transcript, videoName);
      console.log('✍️  Generated blog post content');

      // Step 4: Generate SEO-optimized slug from title
      const slug = this.generateSlug(blogContent.title);
      const videoOutputDir = path.join(this.outputDir, slug);

      // Create output directory
      await fs.ensureDir(videoOutputDir);
      console.log(`📁 Created output directory: ${videoOutputDir}`);

      // Step 5: Extract thumbnail from video
      const thumbnailFilename = `${slug}.jpg`;
      const thumbnailPath = await this.extractThumbnail(
        videoPath,
        videoOutputDir,
        thumbnailFilename
      );
      console.log(`🖼️  Extracted thumbnail: ${thumbnailPath}`);

      // Save transcript
      const transcriptPath = path.join(videoOutputDir, 'transcript.txt');
      await fs.writeFile(transcriptPath, transcript);
      console.log(`💾 Saved transcript: ${transcriptPath}`);

      // Step 6: Create MDX file
      const mdxContent = this.createMDXContent(blogContent, slug);
      const mdxPath = path.join(videoOutputDir, 'blog-post.mdx');
      await fs.writeFile(mdxPath, mdxContent);
      console.log(`📄 Created MDX file: ${mdxPath}`);

      // Step 7: Create blog post metadata
      const blogPostMeta = this.createBlogPostMeta(
        blogContent,
        slug,
        thumbnailFilename
      );
      const metaPath = path.join(videoOutputDir, 'blogPost.ts');
      await fs.writeFile(metaPath, this.generateMetaFile(blogPostMeta));
      console.log(`📊 Created metadata file: ${metaPath}`);

      console.log('✅ Video processing completed successfully!');
      console.log(`📂 Output files in: ${videoOutputDir}`);

      return {
        transcriptPath,
        mdxPath,
        metaPath,
        thumbnailPath,
      };
    } catch (error) {
      console.error('❌ Error processing video:', error.message);
      throw error;
    }
  }

  async extractThumbnail(videoPath, outputDir, filename) {
    return new Promise((resolve, reject) => {
      const thumbnailPath = path.join(outputDir, filename);

      ffmpeg(videoPath)
        .screenshots({
          timestamps: ['00:00:01'], // Extract frame at 1 second
          filename: filename,
          folder: outputDir,
          size: '1280x720',
        })
        .on('end', () => {
          resolve(thumbnailPath);
        })
        .on('error', (err) => {
          reject(new Error(`FFmpeg error: ${err.message}`));
        });
    });
  }

  async transcribeVideo(videoPath) {
    try {
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(videoPath),
        model: 'gpt-4o-transcribe',
        response_format: 'text',
      });

      return transcription;
    } catch (error) {
      throw new Error(`Transcription failed: ${error.message}`);
    }
  }

  async generateBlogPost(transcript, videoName) {
    try {
      const prompt = `Transform this video transcript into a professional blog post. Create an engaging title, compelling description, and well-structured content with proper headings and formatting. In order to increase credibility, add links **throughout** the content to high domain authority websites where you see fit, using the markdown format [text](url) for anchor tags. Do not add more than 5 links, and be sure to include any of these in a "References" section at the end of the blog post as well. Any instances of double quotes that appear in the content, excluding <pre> and <code> sections, should be replaced with &ldquo; and &rdquo; appropriately for HTML compatibility.

Video name: ${videoName}
Transcript: ${transcript}

Respond with JSON in this format:
{
  "title": "The blog post title",
  "description": "A compelling description of the blog post",
  "content": "The full blog post content in markdown format. Do not include the title or description here, just the content."
}`;

      const completion = await openai.chat.completions.create({
        model: 'gpt-5-mini-2025-08-07',
        messages: [
          {
            role: 'system',
            content:
              'You are a professional content writer. Convert video transcripts into engaging blog posts. Respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        response_format: { type: 'json_object' },
      });

      const response = completion.choices[0].message.content;
      return JSON.parse(response);
    } catch (error) {
      console.error('❌ Blog post generation failed:', error.message);
      throw error;
    }
  }

  createMDXContent(blogContent, _slug) {
    return `
<div className="video-container mb-8">
  <div className="aspect-video w-full max-w-4xl mx-auto">
    <iframe
      className="w-full h-full rounded-lg shadow-lg"
      src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
      title="${blogContent.title}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  </div>
</div>

${blogContent.content}

`;
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  }

  createBlogPostMeta(blogContent, slug, thumbnailFilename) {
    // Calculate read time (rough estimate: 200 words per minute)
    const wordCount = blogContent.content.split(/\s+/).length;
    const readTimeMinutes = Math.ceil(wordCount / 200);
    const readTime = `${readTimeMinutes} min read`;

    return {
      slug,
      title: blogContent.title,
      description: blogContent.description,
      author: process.env.BLOG_AUTHOR || 'Kevin Kane',
      date: new Date().toISOString().split('T')[0],
      readTime,
      image: `/blog-images/${thumbnailFilename}`,
    };
  }

  generateMetaFile(blogPostMeta) {
    return `
export const blogPost = ${JSON.stringify(blogPostMeta, null, 2)};
`;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log('Usage: node index.js <video-file-path> [output-directory]');
    console.log('Example: node index.js ./videos/my-video.mp4');
    console.log('Example: node index.js ./videos/my-video.mp4 ./custom-output');
    process.exit(1);
  }

  const videoPath = args[0];
  const outputDir = args[1] || null;
  const processor = new VideoToMarkdown(outputDir);

  try {
    await processor.processVideo(videoPath);
  } catch (error) {
    console.error('❌ Processing failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export default VideoToMarkdown;
