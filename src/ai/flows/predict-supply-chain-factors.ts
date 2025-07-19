'use server';

/**
 * @fileOverview Predicts factors that will affect the supply chain and prices, incorporating real-time data and analysis.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictSupplyChainFactorsInputSchema = z.object({
  productCategory: z.string().describe('The category of the product.'),
  region: z.string().describe('The region for the supply chain.'),
});

export type PredictSupplyChainFactorsInput = z.infer<typeof PredictSupplyChainFactorsInputSchema>;

const PredictSupplyChainFactorsOutputSchema = z.object({
  factors: z.array(z.object({
    factor: z.string().describe('The predicted factor that will affect the supply chain and prices.'),
    impact: z.string().describe('A conclusion of how this factor will affect the supply chain.'),
  })).describe('A list of predicted factors that will affect the supply chain and prices.'),
});

export type PredictSupplyChainFactorsOutput = z.infer<typeof PredictSupplyChainFactorsOutputSchema>;

export async function predictSupplyChainFactors(input: PredictSupplyChainFactorsInput): Promise<PredictSupplyChainFactorsOutput> {
  return predictSupplyChainFactorsFlow(input);
}

const predictSupplyChainFactorsPrompt = ai.definePrompt({
  name: 'predictSupplyChainFactorsPrompt',
  input: {
    schema: z.object({
      productCategory: z.string().describe('The category of the product (e.g., electronics, food).'),
      region: z.string().describe('The region for the supply chain (e.g., USA, Europe).'),
    }),
  },
  output: {
    schema: z.object({
      factors: z.array(z.object({
        factor: z.string().describe('The predicted factor that will affect the supply chain and prices.'),
        impact: z.string().describe('A conclusion of how this factor will affect the supply chain.'),
      })).describe('A list of predicted factors that will affect the supply chain and prices.'),
    }),
  },
  prompt: `You are an AI assistant that predicts factors that will affect the supply chain and prices for a given product category and region. You have access to real-time news, trade data, and economic indicators.
  Consider geopolitical tensions, natural disasters, economic trends, and policy changes to identify the most relevant factors and their potential impact, filtering out irrelevant details. Focus on providing specific, actionable insights.
  Present your findings in a clear and concise tabular format. Consider the country's unique government policies and local consumer preferences when determining the factors.

Product Category: {{{productCategory}}}
Region: {{{region}}}

Identify and output a concise list of factors that are likely to critically affect the supply chain and prices. For each factor, provide a brief conclusion explaining how it will specifically impact the supply chain.
Only provide factors which are highly relevant to the given product category and region. Do not provide general information. Be very specific. Consider all of the information given to you.
Format your output as a table with "Factor" and "Impact" columns. Provide at least 3 distinct factors.
`,
});

const predictSupplyChainFactorsFlow = ai.defineFlow<
  typeof PredictSupplyChainFactorsInputSchema,
  typeof PredictSupplyChainFactorsOutputSchema
>({
  name: 'predictSupplyChainFactorsFlow',
  inputSchema: PredictSupplyChainFactorsInputSchema,
  outputSchema: PredictSupplyChainFactorsOutputSchema,
}, async (input) => {
  const {output} = await predictSupplyChainFactorsPrompt(input);
  return output!;
});
