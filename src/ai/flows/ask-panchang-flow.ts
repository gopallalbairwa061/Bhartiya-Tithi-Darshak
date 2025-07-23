
'use server';
/**
 * @fileOverview A flow for answering questions about the Panchang.
 *
 * - askPanchang - A function that takes a question and panchang data and returns an answer.
 * - AskPanchangInput - The input type for the askPanchang function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { PanchangData } from '@/services/panchang';

// Define the Zod schema for PanchangData details
const DetailSchema = z.object({
  name: z.string(),
  endTime: z.string(),
});

const MuhuratSchema = z.object({
    name: z.string(),
    start: z.string(),
    end: z.string(),
});

const PanchangDataSchema = z.object({
  date: z.string(),
  samvat: z.string(),
  masa: z.string(),
  tithi: z.string(),
  tithiNumber: z.number(),
  paksha: z.string(),
  rashi: z.string(),
  nakshatra: DetailSchema,
  yoga: DetailSchema,
  karana: DetailSchema,
  sunrise: z.string(),
  sunset: z.string(),
  rahuKaal: MuhuratSchema,
  gulikaKaal: MuhuratSchema,
  yamagandam: MuhuratSchema,
  abhijitMuhurat: MuhuratSchema,
});


const AskPanchangInputSchema = z.object({
  question: z.string().describe('The user\'s question about the panchang.'),
  panchang: PanchangDataSchema.describe('The panchang data for the day.'),
});

export type AskPanchangInput = z.infer<typeof AskPanchangInputSchema>;

export async function askPanchang(input: AskPanchangInput): Promise<string> {
    return askPanchangFlow(input);
}

const prompt = ai.definePrompt({
    name: 'askPanchangPrompt',
    input: { schema: AskPanchangInputSchema },
    output: { schema: z.string() },
    prompt: `You are a knowledgeable Hindu priest who can answer questions based on the provided Panchang details for a specific day. Answer the user's question in a clear and concise way in Hindi.

    Panchang Details:
    - तारीख: {{{panchang.date}}}
    - संवत: {{{panchang.samvat}}}
    - मास: {{{panchang.masa}}}
    - पक्ष: {{{panchang.paksha}}}
    - तिथि: {{{panchang.tithi}}}
    - नक्षत्र: {{{panchang.nakshatra.name}}} (समाप्ति: {{{panchang.nakshatra.endTime}}})
    - योग: {{{panchang.yoga.name}}} (समाप्ति: {{{panchang.yoga.endTime}}})
    - करण: {{{panchang.karana.name}}} (समाप्ति: {{{panchang.karana.endTime}}})
    - सूर्योदय: {{{panchang.sunrise}}}
    - सूर्यास्त: {{{panchang.sunset}}}
    - राहु काल: {{{panchang.rahuKaal.start}}} से {{{panchang.rahuKaal.end}}}
    - यमगण्डम: {{{panchang.yamagandam.start}}} से {{{panchang.yamagandam.end}}}
    - गुलिक काल: {{{panchang.gulikaKaal.start}}} से {{{panchang.gulikaKaal.end}}}
    - अभिजीत मुहूर्त: {{{panchang.abhijitMuhurat.start}}} से {{{panchang.abhijitMuhurat.end}}}

    User's Question: {{{question}}}

    Answer in Hindi.
    `,
});

const askPanchangFlow = ai.defineFlow(
    {
        name: 'askPanchangFlow',
        inputSchema: AskPanchangInputSchema,
        outputSchema: z.string(),
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
