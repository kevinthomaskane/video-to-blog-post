# Video to Markdown Converter

A Node.js script that converts video files into markdown blog posts compatible with Next.js MDX. This tool transcribes videos using OpenAI Whisper, generates engaging blog content using GPT-4, and creates all necessary files for a complete blog post.

## Features

- 🎥 **Video Transcription**: Uses OpenAI Whisper for accurate audio-to-text conversion
- ✍️ **AI-Powered Content**: Transforms raw transcripts into professional blog posts using GPT-5
- 🖼️ **Thumbnail Generation**: Automatically extracts video thumbnails with SEO-optimized naming
- 📝 **MDX Compatibility**: Creates Next.js MDX files with proper formatting
- 📊 **Metadata Generation**: Includes blog post metadata for SEO and organization
- 🎯 **YouTube Integration**: Ready-to-use iframe for YouTube video embedding
- 🔄 **Smart Content Transformation**: Converts transcripts into structured, engaging articles
- 🔗 **SEO-Optimized Slugs**: Automatically generates URL-friendly slugs from AI-created titles

## Prerequisites

- Node.js 18+
- FFmpeg installed on your system
- OpenAI API key

### Installing FFmpeg

**macOS (using Homebrew):**

```bash
brew install ffmpeg
```

**Ubuntu/Debian:**

```bash
sudo apt update
sudo apt install ffmpeg
```

**Windows:**
Download from [FFmpeg official website](https://ffmpeg.org/download.html) or use Chocolatey:

```bash
choco install ffmpeg
```

## Installation

1. Clone or download this repository
2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp env.example .env
```

4. Edit `.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=your_openai_api_key_here
BLOG_AUTHOR=Your Name
BLOG_DESCRIPTION_PREFIX=Watch this video about
```

5. (Optional) Run ESLint to check code quality:

```bash
npm run lint
```

## Usage

### Basic Usage

```bash
node index.js path/to/your/video.mp4
```

### Example

```bash
node index.js ./videos/tutorial.mp4
```

### Custom Output Directory

```bash
# Save output to a custom directory
node index.js ./videos/tutorial.mp4 ./my-blog-posts

# Save output to absolute path
node index.js ./videos/tutorial.mp4 /Users/username/Documents/blog-posts
```

### Programmatic Usage

```javascript
import VideoToMarkdown from './index.js';

// Use default output directory
const processor = new VideoToMarkdown();
await processor.processVideo('./videos/tutorial.mp4');

// Use custom output directory
const processor = new VideoToMarkdown('./my-blog-posts');
await processor.processVideo('./videos/tutorial.mp4');
```

## Output Structure

For each processed video, the script creates a directory structure like this:

```
output/
└── seo-optimized-slug/
    ├── transcript.txt          # Raw transcription from Whisper
    ├── blog-post.mdx          # Next.js MDX blog post
    ├── blogPost.ts            # TypeScript metadata file
    └── seo-optimized-slug.jpg # Video thumbnail image
```

### Generated Files

1. **`transcript.txt`**: Raw transcription from OpenAI Whisper
2. **`blog-post.mdx`**: Complete blog post in MDX format with:
   - YouTube iframe placeholder
   - Next.js Image component for thumbnail
   - Structured content with headings
   - Responsive styling
3. **`blogPost.ts`**: TypeScript metadata file containing:
   ```typescript
   export const blogPost = {
     slug: 'seo-optimized-slug-from-title',
     title: 'The AI-Generated Title',
     description: 'A compelling description',
     author: 'Author Name',
     date: '2024-01-01',
     readTime: '5 min read',
     image: '/images/seo-optimized-slug.jpg',
   };
   ```

## Configuration

### Environment Variables

- `OPENAI_API_KEY` (required): Your OpenAI API key
- `BLOG_AUTHOR` (optional): Default author name for blog posts
- `BLOG_DESCRIPTION_PREFIX` (optional): Prefix for auto-generated descriptions

### Customizing Blog Post Generation

The script uses GPT-5 to transform raw video transcripts into professional blog posts. The `generateBlogPost` method:

- **Transforms raw transcripts** into structured, engaging articles
- **Adds proper headings and subheadings** for better organization
- **Creates compelling introductions and conclusions**
- **Includes bullet points and lists** for better readability
- **Makes content SEO-friendly** with proper keyword integration
- **Maintains professional tone** while being conversational

You can modify the prompt in the `generateBlogPost` method to customize the output style, tone, or structure.

## Integration with Next.js

### 1. Copy Generated Files

Copy the generated files to your Next.js project:

```bash
# Copy MDX files to your pages or content directory
cp output/video-name/blog-post.mdx your-nextjs-project/pages/blog/

# Copy images to your public directory
cp output/video-name/*.jpg your-nextjs-project/public/images/
```

### 2. Update YouTube Video ID

Edit the generated MDX file and replace `YOUR_VIDEO_ID` with your actual YouTube video ID:

```mdx
src="https://www.youtube.com/embed/ACTUAL_VIDEO_ID"
```

### 3. Import Metadata

Import the generated metadata in your blog listing:

```typescript
import { blogPost } from './output/video-name/blogPost';

// Use in your blog listing component
const blogPosts = [blogPost];
```

## API Reference

### VideoToMarkdown Class

#### `processVideo(videoPath: string)`

Processes a video file and generates all output files.

**Parameters:**

- `videoPath` (string): Path to the video file

**Returns:** Promise<Object> with paths to generated files

#### Constructor

```javascript
new VideoToMarkdown(outputDir?: string)
```

**Parameters:**

- `outputDir` (optional): Custom output directory path. Defaults to `./output`

**Example:**

```javascript
const processor = new VideoToMarkdown();
const result = await processor.processVideo('./video.mp4');
console.log(result);
// {
//   transcriptPath: 'output/video/transcript.txt',
//   mdxPath: 'output/video/blog-post.mdx',
//   metaPath: 'output/video/blogPost.ts'
// }
```

## Error Handling

The script includes comprehensive error handling for:

- Missing video files
- Invalid OpenAI API keys
- Transcription failures
- File system errors

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Install FFmpeg and ensure it's in your PATH
2. **OpenAI API errors**: Check your API key and billing status
3. **Permission errors**: Ensure write permissions for the output directory
4. **Memory issues**: For large videos, consider processing in smaller chunks
5. **Blog post generation issues**: Check that your OpenAI API key has access to GPT-5 models

### Blog Post Generation

The script uses GPT-5 to reliably transform video transcripts into professional blog posts:

- **Transforms raw transcripts** into professional articles
- **Uses JSON response format** for reliable parsing
- **Creates structured content** with proper headings and formatting
- **Generates engaging titles and descriptions** for SEO

### SEO-Optimized Slug Generation

The script automatically generates SEO-friendly slugs from AI-created titles:

- **Converts titles to URL-safe format** (lowercase, hyphens, no special characters)
- **Uses slug for both directory name and metadata** for consistency
- **Examples**:
  - "How to Optimize Your Website for SEO" → `how-to-optimize-your-website-for-seo`
  - "10 Tips & Tricks for Better Performance" → `10-tips-tricks-for-better-performance`
  - "What's New in React 18?" → `whats-new-in-react-18`

If you're experiencing issues with blog post generation, run the test script:

```bash
node test-blog-generation.js
```

To test SEO slug generation:

```bash
npm run test:seo
```

### Debug Mode

Add more verbose logging by modifying the console.log statements in the code.

## Code Quality

This project uses ESLint for code quality and consistency:

```bash
# Check for linting issues
npm run lint

# Automatically fix linting issues
npm run lint:fix
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `npm run lint` to ensure code quality
5. Add tests if applicable
6. Submit a pull request

## License

ISC License - see package.json for details.

## Support

For issues and questions:

1. Check the troubleshooting section
2. Review the error messages
3. Ensure all prerequisites are met
4. Open an issue with detailed error information
