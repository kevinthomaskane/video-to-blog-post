#!/usr/bin/env node

import { config } from 'dotenv';
import fs from 'fs-extra';
import path from 'path';

// Load environment variables
config();

console.log('🧪 Testing Video to Markdown Setup');
console.log('==================================\n');

async function testSetup () {
  const tests = [];
  
  // Test 1: Check if .env file exists
  console.log('1. Checking environment variables...');
  if (fs.existsSync('.env')) {
    console.log('   ✅ .env file found');
    tests.push(true);
  } else {
    console.log('   ⚠️  .env file not found - please copy env.example to .env');
    tests.push(false);
  }

  // Test 2: Check OpenAI API key
  if (process.env.OPENAI_API_KEY) {
    console.log('   ✅ OPENAI_API_KEY is set');
    tests.push(true);
  } else {
    console.log('   ❌ OPENAI_API_KEY not found in .env file');
    tests.push(false);
  }

  // Test 3: Check if node_modules exists
  console.log('\n2. Checking dependencies...');
  if (fs.existsSync('node_modules')) {
    console.log('   ✅ node_modules directory exists');
    tests.push(true);
  } else {
    console.log('   ❌ node_modules not found - run npm install');
    tests.push(false);
  }

  // Test 4: Check if output directory can be created
  console.log('\n3. Checking file system permissions...');
  try {
    const testDir = path.join(process.cwd(), 'test-output');
    await fs.ensureDir(testDir);
    await fs.remove(testDir);
    console.log('   ✅ Can create and remove directories');
    tests.push(true);
  } catch (error) {
    console.log('   ❌ File system permission error:', error.message);
    tests.push(false);
  }

  // Test 5: Check FFmpeg availability
  console.log('\n4. Checking FFmpeg...');
  try {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);
    
    await execAsync('ffmpeg -version');
    console.log('   ✅ FFmpeg is available');
    tests.push(true);
  } catch (error) {
    console.log('   ❌ FFmpeg not found - please install FFmpeg');
    console.log('      macOS: brew install ffmpeg');
    console.log('      Ubuntu: sudo apt install ffmpeg');
    console.log('      Windows: Download from https://ffmpeg.org/download.html');
    tests.push(false);
  }

  // Test 6: Check if main script can be imported
  console.log('\n5. Checking main script...');
  try {
    await import('./index.js');
    console.log('   ✅ Main script can be imported');
    tests.push(true);
  } catch (error) {
    console.log('   ❌ Error importing main script:', error.message);
    tests.push(false);
  }

  // Summary
  console.log('\n📊 Setup Test Summary');
  console.log('====================');
  const passedTests = tests.filter(test => test).length;
  const totalTests = tests.length;
  
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your setup is ready.');
    console.log('\nNext steps:');
    console.log('1. Place a video file in the project directory');
    console.log('2. Run: node index.js your-video.mp4');
    console.log('3. Check the output/ directory for generated files');
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above before proceeding.');
  }
}

testSetup().catch(console.error);
