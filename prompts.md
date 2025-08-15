the purpose of this project is to transcribe video files and turn them into markdown blog posts that are compatible with @next/mdx. You will write a script in Node.js that allows the user to provide a .mp4 file, you will transcribe it using OpenAI Whisper and then also turn the transcription into a markdown blog post that is compatible with Next.js MDX.

You can convert the transcription into the markdown post using OpenAI API. The blog post should avoid using any em dashes, and should highlight the main message of the video. Each blog post should have an image associated with it, as well as an iframe that will play the video once uploaded to youtube. You will use FFmpeg to get the first frame of the video to use as the blog post's image, and it will be rendered in the .mdx file as a Next.js Image component.

The output for each video should exist in `output/[video-name]/`. Each video's output directory should include a transcript file, a .mdx file, and then a `blogPost.ts` file that will include meta data about the blog post in the following format:

```
export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  author: string;
  date: string;
  readTime: string;
  image?: string;
}
```
