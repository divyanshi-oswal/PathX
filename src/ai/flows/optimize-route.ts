'use server';

/**
 * @fileOverview This file defines a Genkit flow for optimizing delivery routes based on input locations and constraints,
 * integrating Geoapify Routing API for real-time navigation.
 *
 * - optimizeRoute - A function that takes delivery locations and constraints as input and returns an optimized route.
 * - OptimizeRouteInput - The input type for the optimizeRoute function, including start and end coordinates, traffic, and road conditions.
 * - OptimizeRouteOutput - The output type for the optimizeRoute function, providing the optimized route as a series of coordinates and the carbon footprint of the route.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import {Coordinate} from '@/services/mapping';

const OptimizeRouteInputSchema = z.object({
  start: z.object({
    lat: z.number().describe('The latitude of the starting location.'),
    lng: z.number().describe('The longitude of the starting location.'),
  }).describe('The starting location coordinate.'),
  end: z.object({
    lat: z.number().describe('The latitude of the ending location.'),
    lng: z.number().describe('The longitude of the ending location.'),
  }).describe('The ending location coordinate.'),
  constraints: z.string().optional().describe('Optional constraints for the route optimization, such as avoiding highways.'),
  traffic: z.boolean().optional().describe('Whether to consider real-time traffic conditions.'),
  fuelEfficiency: z.boolean().optional().describe('Whether to optimize for fuel efficiency.'),
  roadConditions: z.boolean().optional().describe('Whether to consider road conditions.'),
});

export type OptimizeRouteInput = z.infer<typeof OptimizeRouteInputSchema>;

const OptimizeRouteOutputSchema = z.object({
  route: z.object({
    coordinates: z.array(z.object({
      lat: z.number().describe('The latitude of the coordinate.'),
      lng: z.number().describe('The longitude of the coordinate.'),
    })).describe('The optimized route as a series of coordinates.'),
    distance: z.number().describe('The distance of the route in meters.'),
    duration: z.number().describe('The duration of the route in seconds.'),
  }).describe('The optimized delivery route.'),
  carbonFootprint: z.number().describe('The estimated carbon footprint of the route in kgCO2.'),
});

export type OptimizeRouteOutput = z.infer<typeof OptimizeRouteOutputSchema>;


export async function optimizeRoute(input: OptimizeRouteInput): Promise<OptimizeRouteOutput> {
  return optimizeRouteFlow(input);
}

const routeOptimizationPrompt = ai.definePrompt({
  name: 'routeOptimizationPrompt',
  input: {
    schema: z.object({
      start: z.object({
        lat: z.number().describe('The latitude of the starting location.'),
        lng: z.number().describe('The longitude of the starting location.'),
      }).describe('The starting location coordinate.'),
      end: z.object({
        lat: z.number().describe('The latitude of the ending location.'),
        lng: z.number().describe('The longitude of the ending location.'),
      }).describe('The ending location coordinate.'),
      constraints: z.string().optional().describe('Optional constraints for the route optimization, such as avoiding highways.'),
      traffic: z.boolean().optional().describe('Whether to consider real-time traffic conditions.'),
      fuelEfficiency: z.boolean().optional().describe('Whether to optimize for fuel efficiency.'),
      roadConditions: z.boolean().optional().describe('Whether to consider road conditions.'),
    }),
  },
  output: {
    schema: z.object({
      route: z.object({
        coordinates: z.array(z.object({
          lat: z.number().describe('The latitude of the coordinate.'),
          lng: z.number().describe('The longitude of the coordinate.'),
        })).describe('The optimized route as a series of coordinates.'),
        distance: z.number().describe('The distance of the route in meters.'),
        duration: z.number().describe('The duration of the route in seconds.'),
      }).describe('The optimized delivery route.'),
      carbonFootprint: z.number().describe('The estimated carbon footprint of the route in kgCO2.'),
    }),
  },
  prompt: `You are an AI logistics expert specializing in route optimization.

You are given a start and end location, and asked to compute an optimal route, according to the following constraints.

Start Location: {{{start}}}
End Location: {{{end}}}
Constraints: {{{constraints}}}
Consider Traffic: {{{traffic}}}
Consider Fuel Efficiency: {{{fuelEfficiency}}}
Consider Road Conditions: {{{roadConditions}}}

Output the route as a series of coordinates, the distance of the route in meters, the duration of the route in seconds, and the estimated carbon footprint of the route.  The carbon footprint should be in kgCO2.
`,
});

const optimizeRouteFlow = ai.defineFlow<
  typeof OptimizeRouteInputSchema,
  typeof OptimizeRouteOutputSchema
>({
  name: 'optimizeRouteFlow',
  inputSchema: OptimizeRouteInputSchema,
  outputSchema: OptimizeRouteOutputSchema,
},
async input => {
    const {start, end} = input;
    const geoapifyApiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY;

    if (!geoapifyApiKey) {
      throw new Error('Geoapify API key is missing. Please set the NEXT_PUBLIC_GEOAPIFY_API_KEY environment variable.');
    }

    const baseUrl = 'https://api.geoapify.com/v1/routeplanner';
    const url = `${baseUrl}?apiKey=${geoapifyApiKey}&waypoints=${start.lat},${start.lng}|${end.lat},${end.lng}&mode=drive`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0];
        const coordinates = route.geometry.coordinates[0].map((coord: number[]) => ({
          lng: coord[0],
          lat: coord[1],
        }));
        const distance = route.properties.distance;
        const duration = route.properties.time;

        const carbonFootprint = distance * 0.0001; // Placeholder carbon footprint calculation.

        return {
          route: {
            coordinates: coordinates,
            distance: distance,
            duration: duration,
          },
          carbonFootprint: carbonFootprint,
        };
      } else {
        throw new Error('No routes found.');
      }
    } catch (error: any) {
      console.error('Error in optimizeRouteFlow:', error);
      throw new Error(`Route optimization failed: ${error.message}`);
    }
  });
