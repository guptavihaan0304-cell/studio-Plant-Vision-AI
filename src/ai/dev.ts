import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-plant-disease.ts';
import '@/ai/flows/identify-plant-species.ts';
import '@/ai/flows/suggest-plant-care-remedies.ts';
import '@/ai/flows/assistant-flow.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/text-to-speech.ts';
