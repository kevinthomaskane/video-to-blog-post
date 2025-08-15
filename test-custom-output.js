#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs-extra';
import path from 'path';

// Load environment variables
config();

console.log('🧪 Testing Custom Output Directory');
console.log('==================================\n');

async function testCustomOutput() {
  try {
    // Import the VideoToMarkdown class
    const { default: VideoToMarkdown } = await import('./index.js');
    
    // Test with default output directory
    console.log('1. Testing default output directory...');
    const defaultProcessor = new VideoToMarkdown();
    console.log(`   Default output dir: ${defaultProcessor.outputDir}`);
    
    // Test with custom output directory
    console.log('\n2. Testing custom output directory...');
    const customProcessor = new VideoToMarkdown('./test-output');
    console.log(`   Custom output dir: ${customProcessor.outputDir}`);
    
    // Test with absolute path
    console.log('\n3. Testing absolute path...');
    const absolutePath = path.join(process.cwd(), 'absolute-test-output');
    const absoluteProcessor = new VideoToMarkdown(absolutePath);
    console.log(`   Absolute output dir: ${absoluteProcessor.outputDir}`);
    
    // Test directory creation
    console.log('\n4. Testing directory creation...');
    await fs.ensureDir(customProcessor.outputDir);
    console.log(`   ✅ Created directory: ${customProcessor.outputDir}`);
    
    // Clean up test directories
    console.log('\n5. Cleaning up test directories...');
    await fs.remove('./test-output');
    await fs.remove('./absolute-test-output');
    console.log('   ✅ Cleaned up test directories');
    
    console.log('\n🎉 Custom output directory test completed successfully!');
    console.log('\nUsage examples:');
    console.log('  node index.js video.mp4                    # Default: ./output');
    console.log('  node index.js video.mp4 ./my-blog-posts    # Custom: ./my-blog-posts');
    console.log('  node index.js video.mp4 /absolute/path     # Absolute: /absolute/path');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCustomOutput();
