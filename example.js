#!/usr/bin/env node

import VideoToMarkdown from './index.js';

// Example usage of the VideoToMarkdown class
async function example () {
  try {
    console.log('🎬 Video to Markdown Converter Example');
    console.log('=====================================\n');

    // Initialize the processor with custom output directory
    const processor = new VideoToMarkdown('./custom-output');

    // Example video path (replace with your actual video file)
    const videoPath = './example-video.mp4';

    console.log(`Processing video: ${videoPath}`);
    console.log('This will:');
    console.log('1. Extract a thumbnail from the video');
    console.log('2. Transcribe the audio using OpenAI Whisper');
    console.log('3. Generate a blog post using GPT-4');
    console.log('4. Create MDX and metadata files');
    console.log('');

    // Process the video
    const result = await processor.processVideo(videoPath);

    console.log('\n✅ Processing completed!');
    console.log('\nGenerated files:');
    console.log(`📄 Transcript: ${result.transcriptPath}`);
    console.log(`📝 MDX Blog Post: ${result.mdxPath}`);
    console.log(`📊 Metadata: ${result.metaPath}`);
    console.log(`🖼️  Thumbnail: ${result.imagePath}`);

    console.log('\nNext steps:');
    console.log('1. Copy the MDX file to your Next.js project');
    console.log('2. Update the YouTube video ID in the MDX file');
    console.log('3. Import the metadata in your blog listing');

  } catch (error) {
    console.error('❌ Example failed:', error.message);
    console.log('\nMake sure you have:');
    console.log('- A valid OpenAI API key in your .env file');
    console.log('- FFmpeg installed on your system');
    console.log('- A valid video file to process');
  }
}

// Run the example
example();
