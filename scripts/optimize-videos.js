#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Video optimization script for Sabrang 2025
// This script helps compress videos for web deployment

const VIDEO_DIR = path.join(__dirname, '../public/video');
const OUTPUT_DIR = path.join(__dirname, '../public/video/optimized');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Video optimization settings
const OPTIMIZATION_SETTINGS = {
  // For hero video (main background)
  hero: {
    width: 1280,
    height: 720,
    bitrate: '1000k',
    crf: 28,
    preset: 'fast'
  },
  // For about section videos
  about: {
    width: 960,
    height: 540,
    bitrate: '800k',
    crf: 30,
    preset: 'fast'
  },
  // For loading video
  loading: {
    width: 1280,
    height: 720,
    bitrate: '1200k',
    crf: 26,
    preset: 'fast'
  }
};

// Check if FFmpeg is available
function checkFFmpeg() {
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return true;
  } catch (error) {
    console.error('❌ FFmpeg not found. Please install FFmpeg first:');
    console.error('   Windows: https://ffmpeg.org/download.html');
    console.error('   macOS: brew install ffmpeg');
    console.error('   Ubuntu: sudo apt install ffmpeg');
    return false;
  }
}

// Optimize a single video file
function optimizeVideo(inputPath, outputPath, settings) {
  const { width, height, bitrate, crf, preset } = settings;
  
  const command = `ffmpeg -i "${inputPath}" -vf "scale=${width}:${height}" -c:v libx264 -crf ${crf} -preset ${preset} -b:v ${bitrate} -c:a aac -b:a 128k -movflags +faststart "${outputPath}" -y`;
  
  try {
    console.log(`🔄 Optimizing: ${path.basename(inputPath)}`);
    execSync(command, { stdio: 'inherit' });
    
    const originalSize = fs.statSync(inputPath).size;
    const optimizedSize = fs.statSync(outputPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
    
    console.log(`✅ Optimized: ${path.basename(inputPath)}`);
    console.log(`   Original: ${(originalSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Optimized: ${(optimizedSize / 1024 / 1024).toFixed(1)}MB`);
    console.log(`   Reduction: ${reduction}%`);
    console.log('');
    
    return true;
  } catch (error) {
    console.error(`❌ Failed to optimize: ${path.basename(inputPath)}`);
    return false;
  }
}

// Create WebM version
function createWebM(inputPath, outputPath, settings) {
  const { width, height } = settings;
  
  const command = `ffmpeg -i "${inputPath}" -vf "scale=${width}:${height}" -c:v libvpx-vp9 -crf 30 -b:v 0 -c:a libopus "${outputPath}" -y`;
  
  try {
    console.log(`🔄 Creating WebM: ${path.basename(inputPath)}`);
    execSync(command, { stdio: 'inherit' });
    console.log(`✅ WebM created: ${path.basename(outputPath)}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to create WebM: ${path.basename(inputPath)}`);
    return false;
  }
}

// Main optimization function
function optimizeAllVideos() {
  console.log('🎬 Starting video optimization for Sabrang 2025...\n');
  
  if (!checkFFmpeg()) {
    return;
  }
  
  const videos = [
    {
      input: path.join(VIDEO_DIR, 'herovideo.mp4'),
      output: path.join(OUTPUT_DIR, 'herovideo.mp4'),
      webm: path.join(OUTPUT_DIR, 'herovideo.webm'),
      settings: OPTIMIZATION_SETTINGS.hero
    },
    {
      input: path.join(VIDEO_DIR, 'loadingvideo.mp4'),
      output: path.join(OUTPUT_DIR, 'loadingvideo.mp4'),
      webm: path.join(OUTPUT_DIR, 'loadingvideo.webm'),
      settings: OPTIMIZATION_SETTINGS.loading
    }
  ];
  
  // About section videos
  const aboutVideos = [
    'about-op.mp4',
    'panache.mp4',
    'BandJAM.mp4',
    'Dance (2).mp4'
  ];
  
  aboutVideos.forEach(video => {
    const input = path.join(VIDEO_DIR, 'about-section', video);
    const output = path.join(OUTPUT_DIR, 'about-section', video);
    const webm = path.join(OUTPUT_DIR, 'about-section', video.replace('.mp4', '.webm'));
    
    if (fs.existsSync(input)) {
      videos.push({
        input,
        output,
        webm,
        settings: OPTIMIZATION_SETTINGS.about
      });
    }
  });
  
  // Create about-section directory in output
  const aboutOutputDir = path.join(OUTPUT_DIR, 'about-section');
  if (!fs.existsSync(aboutOutputDir)) {
    fs.mkdirSync(aboutOutputDir, { recursive: true });
  }
  
  let successCount = 0;
  let totalCount = videos.length;
  
  videos.forEach(video => {
    if (fs.existsSync(video.input)) {
      // Optimize MP4
      if (optimizeVideo(video.input, video.output, video.settings)) {
        successCount++;
      }
      
      // Create WebM version
      createWebM(video.input, video.webm, video.settings);
    } else {
      console.log(`⚠️  Skipping: ${path.basename(video.input)} (not found)`);
    }
  });
  
  console.log(`\n🎉 Optimization complete!`);
  console.log(`✅ Successfully optimized: ${successCount}/${totalCount} videos`);
  console.log(`📁 Optimized videos saved to: ${OUTPUT_DIR}`);
  console.log(`\n📋 Next steps:`);
  console.log(`   1. Review the optimized videos in ${OUTPUT_DIR}`);
  console.log(`   2. Replace original videos with optimized versions if satisfied`);
  console.log(`   3. Update video paths in your code if needed`);
  console.log(`   4. Test the website with optimized videos`);
}

// Run the optimization
if (require.main === module) {
  optimizeAllVideos();
}

module.exports = { optimizeAllVideos, checkFFmpeg };
