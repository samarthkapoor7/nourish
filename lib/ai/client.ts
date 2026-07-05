import OpenAI from 'openai';

/**
 * Server-only OpenAI client. Never import this from a Client Component -
 * OPENAI_API_KEY must stay on the server.
 */
export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
