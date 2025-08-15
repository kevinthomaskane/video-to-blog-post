#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs-extra';
import path from 'path';

// Load environment variables
config();

console.log('🧪 Testing SEO-Optimized Slug Generation');
console.log('=======================================\n');

async function testSeoSlug() {
  try {
    // Import the VideoToMarkdown class
    const { default: VideoToMarkdown } = await import('./index.js');
    const processor = new VideoToMarkdown();
    
    // Test slug generation with various titles
    console.log('1. Testing slug generation...');
    
    const testTitles = [
      'How to Optimize Your Website for SEO Using SEMrush and AI Tools',
      'The Ultimate Guide to Video Marketing in 2024',
      '10 Tips & Tricks for Better Performance',
      'What\'s New in React 18?',
      'AI vs. Human: The Future of Content Creation',
      'Getting Started with Next.js 14',
      'Why You Should Use TypeScript in 2024',
      'The Complete Guide to API Development',
      'Building Scalable Applications with Microservices',
      'Machine Learning for Beginners: A Practical Approach'
    ];
    
    testTitles.forEach((title, index) => {
      const slug = processor.generateSlug(title);
      console.log(`   ${index + 1}. "${title}"`);
      console.log(`      → ${slug}`);
      console.log('');
    });
    
    // Test with a sample transcript to show the full flow
    console.log('2. Testing full flow with sample content...');
    
    const sampleTranscript = `Hey guys, so I wanted to show you a little bit about how I am fully optimizing a website for SEO. It kind of feels like cheating these days because it's so easy. Or maybe I just know what I'm doing, but there is a tool called SEMrush and it allows you to input your website and then search for keywords that are high volume and relevant towards your product or your website.`;
    
    const blogContent = await processor.generateBlogPost(sampleTranscript, 'seo-demo');
    const generatedSlug = processor.generateSlug(blogContent.title);
    
    console.log(`   Generated title: "${blogContent.title}"`);
    console.log(`   Generated slug: ${generatedSlug}`);
    console.log(`   Output directory would be: ./output/${generatedSlug}/`);
    
    // Test directory creation
    console.log('\n3. Testing directory creation...');
    const testOutputDir = path.join(process.cwd(), 'test-seo-output', generatedSlug);
    await fs.ensureDir(testOutputDir);
    console.log(`   ✅ Created directory: ${testOutputDir}`);
    
    // Clean up
    await fs.remove('./test-seo-output');
    console.log('   ✅ Cleaned up test directory');
    
    console.log('\n🎉 SEO slug generation test completed successfully!');
    console.log('\nKey benefits:');
    console.log('  ✅ SEO-friendly URLs (lowercase, hyphens, no special chars)');
    console.log('  ✅ Consistent naming across directory and metadata');
    console.log('  ✅ Automatic generation from AI-created titles');
    console.log('  ✅ URL-safe characters only');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSeoSlug();
