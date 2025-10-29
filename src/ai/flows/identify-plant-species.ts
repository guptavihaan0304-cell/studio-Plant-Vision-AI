// Implemented the Genkit flow to identify plant species from an image and provide basic care information.

'use server';

/**
 * @fileOverview An AI agent that identifies plant species from an image and provides basic care information.
 *
 * - identifyPlantSpecies - A function that handles the plant identification process.
 * - IdentifyPlantSpeciesInput - The input type for the identifyPlantSpecies function.
 * - IdentifyPlantSpeciesOutput - The return type for the identifyPlantSpecies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const IdentifyPlantSpeciesInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type IdentifyPlantSpeciesInput = z.infer<typeof IdentifyPlantSpeciesInputSchema>;

const IdentifyPlantSpeciesOutputSchema = z.object({
  plantIdentification: z.object({
    commonName: z.string().describe('The common name of the identified plant.'),
    scientificName: z.string().describe('The scientific name of the identified plant.'),
    growthRate: z.string().describe('The growth rate of the plant.'),
    waterNeeds: z.string().describe('The water needs of the plant.'),
    sunlightRequirements: z.string().describe('The sunlight requirements of the plant.'),
  }),
});
export type IdentifyPlantSpeciesOutput = z.infer<typeof IdentifyPlantSpeciesOutputSchema>;

export async function identifyPlantSpecies(input: IdentifyPlantSpeciesInput): Promise<IdentifyPlantSpeciesOutput> {
  return identifyPlantSpeciesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPlantSpeciesPrompt',
  input: {schema: IdentifyPlantSpeciesInputSchema},
  output: {schema: IdentifyPlantSpeciesOutputSchema},
  prompt: `You are an expert botanist specializing in plant identification and care.

You will use this information to identify the plant species and provide basic care information.

Photo: {{media url=photoDataUri}}

Respond using JSON. Do not include any text outside of the JSON object. Provide the following information:

*   commonName: The common name of the identified plant.
*   scientificName: The scientific name of the identified plant.
*   growthRate: The growth rate of the plant (e.g., fast, moderate, slow).
*   waterNeeds: The water needs of the plant (e.g., high, moderate, low).
*   sunlightRequirements: The sunlight requirements of the plant (e.g., full sun, partial shade, full shade).`,
});

const identifyPlantSpeciesFlow = ai.defineFlow(
  {
    name: 'identifyPlantSpeciesFlow',
    inputSchema: IdentifyPlantSpeciesInputSchema,
    outputSchema: IdentifyPlantSpeciesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
