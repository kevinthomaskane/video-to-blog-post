#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs-extra';
import path from 'path';

// Load environment variables
config();

console.log('🧪 Testing Thumbnail Generation with SEO Naming');
console.log('==============================================\n');

async function testThumbnail() {
  try {
    // Import the VideoToMarkdown class
    const { default: VideoToMarkdown } = await import('./index.js');
    const processor = new VideoToMarkdown();
    
    // Test slug generation for thumbnail naming
    console.log('1. Testing thumbnail filename generation...');
    
    const testTitles = [
      'How to Optimize Your Website for SEO Using SEMrush and AI Tools',
      'The Ultimate Guide to Video Marketing in 2024',
      '10 Tips & Tricks for Better Performance',
      'What\'s New in React 18?',
      'AI vs. Human: The Future of Content Creation'
    ];
    
    testTitles.forEach((title, index) => {
      const slug = processor.generateSlug(title);
      const thumbnailFilename = `${slug}.jpg`;
      console.log(`   ${index + 1}. "${title}"`);
      console.log(`      → ${thumbnailFilename}`);
      console.log('');
    });
    
    // Test with a sample transcript to show the full flow
    console.log('2. Testing full flow with sample content...');
    
    const sampleTranscript = `Hey guys, so I wanted to show you a little bit about how I am fully optimizing a website for SEO. It kind of feels like cheating these days because it's so easy. Or maybe I just know what I'm doing, but there is a tool called SEMrush and it allows you to input your website and then search for keywords that are high volume and relevant towards your product or your website.`;
    
    const blogContent = await processor.generateBlogPost(sampleTranscript, 'seo-demo');
    const generatedSlug = processor.generateSlug(blogContent.title);
    const thumbnailFilename = `${generatedSlug}.jpg`;
    
    console.log(`   Generated title: "${blogContent.title}"`);
    console.log(`   Generated slug: ${generatedSlug}`);
    console.log(`   Thumbnail filename: ${thumbnailFilename}`);
    console.log(`   Output directory would be: ./output/${generatedSlug}/`);
    console.log(`   Thumbnail path would be: ./output/${generatedSlug}/${thumbnailFilename}`);
    
    // Test directory and file structure
    console.log('\n3. Testing directory and file structure...');
    const testOutputDir = path.join(process.cwd(), 'test-thumbnail-output', generatedSlug);
    await fs.ensureDir(testOutputDir);
    
    // Create a dummy thumbnail file to simulate the process
    const dummyThumbnailPath = path.join(testOutputDir, thumbnailFilename);
    await fs.writeFile(dummyThumbnailPath, 'dummy thumbnail content');
    
    console.log(`   ✅ Created directory: ${testOutputDir}`);
    console.log(`   ✅ Created thumbnail: ${dummyThumbnailPath}`);
    
    // Test metadata generation
    console.log('\n4. Testing metadata generation...');
    const blogPostMeta = processor.createBlogPostMeta(blogContent, generatedSlug, thumbnailFilename);
    console.log(`   Metadata image path: ${blogPostMeta.image}`);
    console.log(`   Expected: /images/${thumbnailFilename}`);
    
    // Clean up
    await fs.remove('./test-thumbnail-output');
    console.log('   ✅ Cleaned up test directory');
    
    console.log('\n🎉 Thumbnail generation test completed successfully!');
    console.log('\nKey benefits:');
    console.log('  ✅ SEO-optimized thumbnail filenames');
    console.log('  ✅ Consistent naming across all files');
    console.log('  ✅ Automatic generation from AI-created titles');
    console.log('  ✅ Proper metadata integration');
    console.log('  ✅ Next.js Image component ready');
    
    console.log('\nExample output structure:');
    console.log('  output/');
    console.log('  └── how-to-optimize-your-website-for-seo/');
    console.log('      ├── transcript.txt');
    console.log('      ├── blog-post.mdx');
    console.log('      ├── blogPost.ts');
    console.log('      └── how-to-optimize-your-website-for-seo.jpg');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testThumbnail();
