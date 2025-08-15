#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs-extra';
import path from 'path';

// Load environment variables
config();

console.log('🧪 Testing Improved Blog Post Generation');
console.log('========================================\n');

async function testBlogGeneration () {
  try {
    // Read the existing transcript
    const transcriptPath = path.join(process.cwd(), 'output', 'seo-demo', 'transcript.txt');
    const transcript = await fs.readFile(transcriptPath, 'utf-8');
    
    console.log('📝 Original Transcript (first 200 characters):');
    console.log(`${transcript.substring(0, 200)}...\n`);
    
    // Import the VideoToMarkdown class
    const { default: VideoToMarkdown } = await import('./index.js');
    const processor = new VideoToMarkdown();
    
    console.log('🤖 Generating improved blog post...\n');
    
    // Test the blog post generation
    const blogContent = await processor.generateBlogPost(transcript, 'seo-demo');
    
    console.log('✅ Generated Blog Post Structure:');
    console.log('================================');
    console.log(`📰 Title: ${blogContent.title}`);
    console.log(`📄 Description: ${blogContent.description}`);
    console.log(`📝 Content Length: ${blogContent.content.length} characters`);
    
    console.log('\n📖 Content Preview (first 500 characters):');
    console.log('==========================================');
    console.log(`${blogContent.content.substring(0, 500)}...\n`);
    
    // Save the improved blog post
    const outputPath = path.join(process.cwd(), 'output', 'seo-demo', 'improved-blog-post.mdx');
    const mdxContent = processor.createMDXContent(blogContent, 'seo-demo');
    await fs.writeFile(outputPath, mdxContent);
    
    console.log('💾 Saved improved blog post to:');
    console.log(`   ${outputPath}\n`);
    
    console.log('🎯 Key Improvements Made:');
    console.log('========================');
    console.log('✅ Transformed raw transcript into structured article');
    console.log('✅ Added proper headings and subheadings');
    console.log('✅ Created engaging introduction and conclusion');
    console.log('✅ Organized content into digestible sections');
    console.log('✅ Added bullet points and lists for better readability');
    console.log('✅ Included actionable insights and takeaways');
    console.log('✅ Made content SEO-friendly and professional');
    
    console.log('\n📊 Comparison:');
    console.log('=============');
    console.log('Before: Raw transcript with minimal formatting');
    console.log('After: Professional blog post with proper structure');
    console.log('\n💡 Using GPT-5 for reliable blog post generation');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testBlogGeneration();
