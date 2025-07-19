'use server';

/**
 * @fileOverview Predicts user orders based on buying patterns, considering seasonality, festivals, local events,
 * current date and time, and new product releases.
 *
 * - predictOrder - A function to predict user orders.
 * - PredictOrderInput - The input type for the predictOrder function.
 * - PredictOrderOutput - The return type for the predictOrder function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {getGroceryProducts} from '@/services/inventory'; // Import function to fetch grocery products

const PredictOrderInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  season: z.string().optional().describe('The current season (e.g., "Summer", "Winter").'),
  festival: z.string().optional().describe('Any upcoming festival or holiday (e.g., "Christmas", "Diwali").'),
  localEvent: z.string().optional().describe('Any local event that might affect buying patterns (e.g., "Marathon", "Concert").'),
  socialMediaTrends: z.string().optional().describe('Trending products or items on social media.'),
  newProductReleases: z.string().optional().describe('Any new product releases that might affect buying patterns.'),
  currentTime: z.string().describe('The current time (e.g., "Morning", "Afternoon", "Evening").'),
  currentDate: z.string().describe('The current date (e.g., "YYYY-MM-DD").'),
});
export type PredictOrderInput = z.infer<typeof PredictOrderInputSchema>;

const PredictedOrderItemSchema = z.object({
  item: z.string().describe('The name of the predicted item.'),
  quantity: z.number().describe('The predicted quantity of the item.'),
  productCategory: z.string().describe('The category of the predicted item.'),
});

const PredictOrderOutputSchema = z.object({
  predictedOrder: z.array(PredictedOrderItemSchema).describe('A list of predicted items for the user\'s next order, including quantity and product category.'),
  reasoning: z.string().optional().describe('Explanation of why these items were predicted, based on the provided factors.'),
});
export type PredictOrderOutput = z.infer<typeof PredictOrderOutputSchema>;

export async function predictOrder(input: PredictOrderInput): Promise<PredictOrderOutput> {
  return predictOrderFlow(input);
}

const predictOrderPrompt = ai.definePrompt({
  name: 'predictOrderPrompt',
  input: {
    schema: z.object({
      userId: z.string().describe('The ID of the user.'),
      recentOrders: z.array(z.string()).describe('A list of recent orders by the user.'),
      season: z.string().optional().describe('The current season (e.g., "Summer", "Winter").'),
      festival: z.string().optional().describe('Any upcoming festival or holiday (e.g., "Christmas", "Diwali").'),
      localEvent: z.string().optional().describe('Any local event that might affect buying patterns (e.g., "Marathon", "Concert").'),
      socialMediaTrends: z.string().optional().describe('Trending products or items on social media.'),
      newProductReleases: z.string().optional().describe('Any new product releases that might affect buying patterns.'),
      currentTime: z.string().describe('The current time (e.g., "Morning", "Afternoon", "Evening").'),
      currentDate: z.string().describe('The current date (e.g., "YYYY-MM-DD").'),
    }),
  },
  output: {
    schema: z.object({
      predictedOrder: z.array(z.string()).describe('A list of predicted items for the user\'s next order.'),
      reasoning: z.string().optional().describe('Explanation of why these items were predicted, based on the provided factors.'),
    }),
  },
  prompt: `You are an AI assistant that predicts the next order of a user based on their past orders, current season, festivals, local events, social media trends, the current date and time, and new product releases.

Consider the following information to predict the order:
User ID: {{{userId}}}
Recent Orders: {{{recentOrders}}}
Current Season: {{{season}}}
Upcoming Festival/Holiday: {{{festival}}}
Local Event: {{{localEvent}}}
Social Media Trends: {{{socialMediaTrends}}}
New Product Releases: {{{newProductReleases}}}
Current Time: {{{currentTime}}}
Current Date: {{{currentDate}}}

Output a list of items that the user is likely to order next. Also, provide a brief explanation of your reasoning behind the prediction, considering the user's past orders and the provided contextual factors.
For each item, you need to consider the product category.
For example, if the current time is morning, the user might order breakfast items. If there's a new product release in the snack category, the user might be interested in trying it.
`,
});

const predictOrderFlow = ai.defineFlow<
  typeof PredictOrderInputSchema,
  typeof PredictOrderOutputSchema
>({
  name: 'predictOrderFlow',
  inputSchema: PredictOrderInputSchema,
  outputSchema: PredictOrderOutputSchema,
}, async (input) => {
  const recentOrders = [
    'Ground Beef',
    'White Bread',
    'Apples',
  ];

  const {output} = await predictOrderPrompt({...input, recentOrders});

  //Transform predictedOrder to include a default quantity and product category for each item
  const predictedOrderWithDetails = output?.predictedOrder.map(item => ({
    item: item,
    quantity: 1,
    productCategory: 'Unknown'  // Replace with a service to lookup the category.
  }));

  return {
    predictedOrder: predictedOrderWithDetails,
    reasoning: output?.reasoning,
  };
});

