'use server';
/**
 * @fileOverview Suggests natural remedies and care tips tailored to the identified plant issue and species.
 *
 * - suggestPlantCareRemedies - A function that suggests plant care remedies.
 * - SuggestPlantCareRemediesInput - The input type for the suggestPlantCareRemedies function.
 * - SuggestPlantCareRemediesOutput - The return type for the suggestPlantCareRemedies function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestPlantCareRemediesInputSchema = z.object({
  plantName: z.string().describe('The common name of the plant.'),
  diagnosis: z.string().describe('The diagnosis of the plant issue.'),
});
export type SuggestPlantCareRemediesInput = z.infer<typeof SuggestPlantCareRemediesInputSchema>;

const SuggestPlantCareRemediesOutputSchema = z.object({
  remedies: z.string().describe('Suggested natural remedies and care tips for the plant issue.'),
});
export type SuggestPlantCareRemediesOutput = z.infer<typeof SuggestPlantCareRemediesOutputSchema>;

export async function suggestPlantCareRemedies(
  input: SuggestPlantCareRemediesInput
): Promise<SuggestPlantCareRemediesOutput> {
  return suggestPlantCareRemediesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestPlantCareRemediesPrompt',
  input: {schema: SuggestPlantCareRemediesInputSchema},
  output: {schema: SuggestPlantCareRemediesOutputSchema},
  prompt: `You are an expert in plant care and provide advice on natural and organic remedies.

  Based on the plant name and diagnosis, suggest natural remedies and care tips.

  Plant Name: {{{plantName}}}
  Diagnosis: {{{diagnosis}}}

  Provide detailed and practical advice.`,
});

const suggestPlantCareRemediesFlow = ai.defineFlow(
  {
    name: 'suggestPlantCareRemediesFlow',
    inputSchema: SuggestPlantCareRemediesInputSchema,
    outputSchema: SuggestPlantCareRemediesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
