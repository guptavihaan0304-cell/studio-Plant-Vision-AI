import { config } from 'dotenv';
config();

import '@/ai/flows/diagnose-plant-disease.ts';
import '@/ai/flows/identify-plant-species.ts';
import '@/ai/flows/suggest-plant-care-remedies.ts';