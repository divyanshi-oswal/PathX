'use server';
/**
 * @fileOverview A blog content generation AI agent.
 *
 * - generateBlogContent - A function that handles the blog content generation process.
 * - GenerateBlogContentInput - The input type for the generateBlogContent function.
 * - GenerateBlogContentOutput - The return type for the generateBlogContent function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateBlogContentInputSchema = z.object({
  topic: z.string().describe('The topic of the blog post.'),
});
export type GenerateBlogContentInput = z.infer<typeof GenerateBlogContentInputSchema>;

const GenerateBlogContentOutputSchema = z.object({
  content: z.string().describe('The generated content of the blog post.'),
});
export type GenerateBlogContentOutput = z.infer<typeof GenerateBlogContentOutputSchema>;

export async function generateBlogContent(input: GenerateBlogContentInput): Promise<GenerateBlogContentOutput> {
  return generateBlogContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateBlogContentPrompt',
  input: {
    schema: z.object({
      topic: z.string().describe('The topic of the blog post.'),
      onlineInformation: z.string().describe('Information about topic gathered online'),
    }),
  },
  output: {
    schema: z.object({
      content: z.string().describe('The generated content of the blog post.'),
    }),
  },
  prompt: `You are an expert blog post writer, skilled at creating engaging and informative content. Your task is to write a blog post on the given topic, incorporating the provided online information to enrich the content. Ensure the blog post is well-structured with appropriate headings, subheadings, and paragraphs to enhance readability. Avoid using hashtags or asterisks. The tone should be professional and engaging. Use HTML Paragraph tags in place of newlines, and markdown headings.

Topic: {{{topic}}}

Online Information:
{{{onlineInformation}}}

Craft a compelling blog post that is easy to read and understand, providing valuable insights to the reader.
`,
});

const getOnlineInformation = ai.defineTool({
    name: 'getOnlineInformation',
    description: 'Retrieves information from the internet about a given topic.',
    inputSchema: z.object({
      topic: z.string().describe('The topic to retrieve information about.'),
    }),
    outputSchema: z.string(),
  },
  async input => {
    // Placeholder for actual online information retrieval.
    // In a real application, this would use a search engine or web scraping.
    return `Simulated online information about ${input.topic}.  This is a placeholder.`;
  }
);

const generateBlogContentFlow = ai.defineFlow<
  typeof GenerateBlogContentInputSchema,
  typeof GenerateBlogContentOutputSchema
>({
  name: 'generateBlogContentFlow',
  inputSchema: GenerateBlogContentInputSchema,
  outputSchema: GenerateBlogContentOutputSchema,
}, async (input) => {
  const onlineInformation = await getOnlineInformation({topic: input.topic});
  const {output} = await prompt({topic: input.topic, onlineInformation});
  return {
    content: output!.content,
  };
});
