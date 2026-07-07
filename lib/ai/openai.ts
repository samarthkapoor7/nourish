import { createOpenAI } from '@ai-sdk/openai';

export const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OPENAI_REASONING_MODEL = 'gpt-4.1-mini';
