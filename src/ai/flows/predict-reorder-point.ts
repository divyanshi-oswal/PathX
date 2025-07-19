'use server';

/**
 * @fileOverview Predicts the reorder point for a product based on historical data.
 *
 * - predictReorderPoint - A function to predict the reorder point.
 * - PredictReorderPointInput - The input type for the predictReorderPoint function.
 * - PredictReorderPointOutput - The return type for the predictReorderPoint function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PredictReorderPointInputSchema = z.object({
  productId: z.string().describe('The ID of the product.'),
  historicalData: z.array(z.object({
    date: z.string().describe('The date of the data point.'),
    sales: z.number().describe('The sales quantity for the data point.'),
  })).describe('Historical sales data for the product.'),
});
export type PredictReorderPointInput = z.infer<typeof PredictReorderPointInputSchema>;

const PredictReorderPointOutputSchema = z.object({
  reorderPoint: z.number().describe('The predicted reorder point for the product.'),
  confidenceInterval: z.object({
    lower: z.number().describe('The lower bound of the confidence interval.'),
    upper: z.number().describe('The upper bound of the confidence interval.'),
  }).optional().describe('The confidence interval for the reorder point prediction.'),
});
export type PredictReorderPointOutput = z.infer<typeof PredictReorderPointOutputSchema>;

export async function predictReorderPoint(input: PredictReorderPointInput): Promise<PredictReorderPointOutput> {
  return predictReorderPointFlow(input);
}

const predictReorderPointPrompt = ai.definePrompt({
  name: 'predictReorderPointPrompt',
  input: {
    schema: z.object({
      productId: z.string().describe('The ID of the product.'),
      historicalData: z.array(z.object({
        date: z.string().describe('The date of the data point.'),
        sales: z.number().describe('The sales quantity for the data point.'),
      })).describe('Historical sales data for the product.'),
    }),
  },
  output: {
    schema: z.object({
      reorderPoint: z.number().describe('The predicted reorder point for the product.'),
      confidenceInterval: z.object({
        lower: z.number().describe('The lower bound of the confidence interval.'),
        upper: z.number().describe('The upper bound of the confidence interval.'),
      }).optional().describe('The confidence interval for the reorder point prediction.'),
    }),
  },
  prompt: `You are an AI assistant that predicts the reorder point for a product based on its historical sales data.

Use ARIMA and LSTM models to analyze the data and predict the reorder point. Provide a confidence interval if possible.

Product ID: {{{productId}}}
Historical Data: {{{historicalData}}}

Output the predicted reorder point and, if available, the confidence interval.`,
});

const predictReorderPointFlow = ai.defineFlow<
  typeof PredictReorderPointInputSchema,
  typeof PredictReorderPointOutputSchema
>({
  name: 'predictReorderPointFlow',
  inputSchema: PredictReorderPointInputSchema,
  outputSchema: PredictReorderPointOutputSchema,
}, async (input) => {
  const {output} = await predictReorderPointPrompt(input);
  return output!;
});
