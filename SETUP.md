# Quick Setup Guide

## 🚀 Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

```bash
cp env.example .env
```

Then edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

### 3. Test Your Setup

```bash
node test-setup.js
```

## 📹 Process Your First Video

```bash
# Basic usage
node index.js path/to/your/video.mp4

# With custom output directory
node index.js path/to/your/video.mp4 ./my-blog-posts
```

## 📁 What You'll Get

For each video, the script creates:

- `output/seo-slug/transcript.txt` - Raw transcription
- `output/seo-slug/blog-post.mdx` - Next.js MDX blog post
- `output/seo-slug/blogPost.ts` - TypeScript metadata
- `output/seo-slug/seo-slug.jpg` - Video thumbnail

## 🔧 Prerequisites

- **FFmpeg**: Install with `brew install ffmpeg` (macOS) or `sudo apt install ffmpeg` (Ubuntu)
- **OpenAI API Key**: Get one at https://platform.openai.com/api-keys
- **Node.js 18+**: Download from https://nodejs.org

## 🆘 Need Help?

1. Run `node test-setup.js` to diagnose issues
2. Check the full [README.md](README.md) for detailed documentation
3. Verify your OpenAI API key is valid and has credits

## 💡 Pro Tips

- Use MP4 files for best compatibility
- Videos with clear audio work best for transcription
- The script automatically handles metadata generation and thumbnail extraction
- Generated MDX files are ready for Next.js projects
