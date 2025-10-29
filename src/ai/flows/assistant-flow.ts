'use server';
/**
 * @fileOverview A conversational AI flow for assisting with plant care questions.
 *
 * - chatWithAssistant - A function that takes a user's query and conversation history to generate a response.
 * - ChatWithAssistantInput - The input type for the chatWithAssistant function.
 * - ChatWithAssistantOutput - The return type for the chatWithAssistant function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ChatWithAssistantInputSchema = z.object({
  query: z.string().describe('The user\'s latest message or question.'),
  history: z.string().describe('The previous conversation history.'),
});
export type ChatWithAssistantInput = z.infer<typeof ChatWithAssistantInputSchema>;

const ChatWithAssistantOutputSchema = z.object({
  reply: z.string().describe('The AI assistant\'s response to the user\'s query.'),
});
export type ChatWithAssistantOutput = z.infer<typeof ChatWithAssistantOutputSchema>;

export async function chatWithAssistant(input: ChatWithAssistantInput): Promise<ChatWithAssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: ChatWithAssistantInputSchema },
  output: { schema: ChatWithAssistantOutputSchema },
  prompt: `You are a friendly and knowledgeable AI Plant Care Assistant. Your role is to provide helpful and concise advice on gardening, plant diseases, and general plant care.

Based on the conversation history and the user's latest query, provide a helpful response.

Conversation History:
{{{history}}}

User Query:
{{{query}}}

Your Reply:`,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: ChatWithAssistantInputSchema,
    outputSchema: ChatWithAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
