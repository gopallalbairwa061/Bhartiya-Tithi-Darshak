
'use server';
/**
 * @fileOverview A flow for generating a random API key.
 *
 * - generateApiKey - A function that returns a randomly generated API key.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as crypto from 'crypto';

export async function generateApiKey(): Promise<string> {
  return generateApiKeyFlow();
}

const generateApiKeyFlow = ai.defineFlow(
  {
    name: 'generateApiKeyFlow',
    outputSchema: z.string(),
  },
  async () => {
    // Generate a secure random string for the API key
    return crypto.randomBytes(24).toString('hex');
  }
);
