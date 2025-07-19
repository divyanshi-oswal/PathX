'use server';
/**
 * @fileOverview An AI agent that generates a product name.
 *
 * - generateProductName - A function that handles the product name generation process.
 * - GenerateProductNameInput - The input type for the generateProductName function.
 * - GenerateProductNameOutput - The return type for the generateProductName function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateProductNameInputSchema = z.object({
  productDescription: z.string().describe('The description of the product.'),
});
export type GenerateProductNameInput = z.infer<typeof GenerateProductNameInputSchema>;

const GenerateProductNameOutputSchema = z.object({
  productName: z.string().describe('The name of the generated product.'),
});
export type GenerateProductNameOutput = z.infer<typeof GenerateProductNameOutputSchema>;

export async function generateProductName(input: GenerateProductNameInput): Promise<GenerateProductNameOutput> {
  return generateProductNameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProductNamePrompt',
  input: {
    schema: z.object({
      productDescription: z.string().describe('The description of the product.'),
    }),
  },
  output: {
    schema: z.object({
      productName: z.string().describe('The name of the generated product.'),
    }),
  },
  prompt: `You are an expert product naming assistant.

You will use this information to generate a product name for an item of apparel. Make it sound attractive and unique.
Description: {{{productDescription}}}`,
});

const generateProductNameFlow = ai.defineFlow<
  typeof GenerateProductNameInputSchema,
  typeof GenerateProductNameOutputSchema
>(
  {
    name: 'generateProductNameFlow',
    inputSchema: GenerateProductNameInputSchema,
    outputSchema: GenerateProductNameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
