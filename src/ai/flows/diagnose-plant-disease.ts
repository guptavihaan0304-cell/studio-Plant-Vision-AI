'use server';
/**
 * @fileOverview Flow for diagnosing plant diseases or deficiencies based on a photo.
 *
 * - diagnosePlantDisease - A function that takes a plant photo and returns a detailed diagnosis.
 * - DiagnosePlantDiseaseInput - The input type for the diagnosePlantDisease function.
 * - DiagnosePlantDiseaseOutput - The return type for the diagnosePlantDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DiagnosePlantDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      'A photo of the plant, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.'
    ),
});
export type DiagnosePlantDiseaseInput = z.infer<typeof DiagnosePlantDiseaseInputSchema>;

const DiagnosisSchema = z.object({
  primaryDiagnosis: z.string().describe('The most likely disease or deficiency. If the plant is healthy, this should be only the word "Healthy".'),
  confidence: z.enum(['High', 'Medium', 'Low']).describe('Your confidence level in this diagnosis.'),
  reasoning: z.string().describe('A step-by-step explanation of how you arrived at this diagnosis, based on visual evidence.'),
  possibleOtherDiseases: z.array(z.string()).describe('A list of other possible diseases that might be considered, if any.'),
});

const DiagnosePlantDiseaseOutputSchema = z.object({
  diagnosis: DiagnosisSchema,
});
export type DiagnosePlantDiseaseOutput = z.infer<typeof DiagnosePlantDiseaseOutputSchema>;

export async function diagnosePlantDisease(
  input: DiagnosePlantDiseaseInput
): Promise<DiagnosePlantDiseaseOutput> {
  return diagnosePlantDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'diagnosePlantDiseasePrompt',
  input: {schema: DiagnosePlantDiseaseInputSchema},
  output: {schema: DiagnosePlantDiseaseOutputSchema},
  prompt: `You are a world-renowned plant pathologist with decades of experience in diagnosing plant diseases from visual inspection. You are known for your precision and detailed analysis.

Analyze the following image of a plant and provide a comprehensive diagnosis.

Plant Image: {{media url=photoDataUri}}

Your response must be a JSON object.

If the plant appears to be completely healthy and free of any disease or deficiency, the primaryDiagnosis should be the single word: "Healthy". In this case, confidence should be 'High', reasoning should state that no signs of distress were found, and possibleOtherDiseases should be an empty array.

Otherwise, provide a detailed diagnosis including:
1.  **primaryDiagnosis**: The most likely disease or deficiency.
2.  **confidence**: Your confidence in this primary diagnosis (High, Medium, or Low).
3.  **reasoning**: A detailed, step-by-step explanation for your diagnosis, citing specific visual evidence from the image (e.g., "yellow spots on lower leaves," "powdery white substance on the stem").
4.  **possibleOtherDiseases**: A list of 1-2 alternative diagnoses that could also explain some of the symptoms, if applicable.
`,
});

const diagnosePlantDiseaseFlow = ai.defineFlow(
  {
    name: 'diagnosePlantDiseaseFlow',
    inputSchema: DiagnosePlantDiseaseInputSchema,
    outputSchema: DiagnosePlantDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
