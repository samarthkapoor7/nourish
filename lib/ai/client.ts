import { GoogleGenAI } from '@google/genai';

/**
 * Server-only Gemini client. Never import this from a Client Component -
 * GEMINI_API_KEY must stay on the server.
 */
export const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
