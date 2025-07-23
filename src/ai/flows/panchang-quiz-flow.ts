
'use server';
/**
 * @fileOverview A flow for generating and evaluating quiz questions about Indian culture and Panchang.
 *
 * - generateQuestions - Generates a new quiz question.
 * - evaluateAnswer - Evaluates the user's answer to a quiz question.
 * - QuizQuestion - The type for a quiz question object.
 * - EvaluateAnswerInput - The input type for the evaluateAnswer function.
 * - EvaluateAnswerOutput - The output type for the evaluateAnswer function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

// Schema for the question and its correct answer
const QuizQuestionSchema = z.object({
  question: z.string().describe('A quiz question about Indian culture or Panchang in Hindi.'),
  answer: z.string().describe('The correct answer to the question in Hindi.'),
});
export type QuizQuestion = z.infer<typeof QuizQuestionSchema>;

const QuestionsSchema = z.object({
  questions: z.array(QuizQuestionSchema),
});

// Schema for the input to the answer evaluation flow
const EvaluateAnswerInputSchema = z.object({
  question: z.string().describe('The original question that was asked.'),
  answer: z.string().describe('The correct answer to the question.'),
  userAnswer: z.string().describe("The user's provided answer."),
});
export type EvaluateAnswerInput = z.infer<typeof EvaluateAnswerInputSchema>;

// Schema for the output of the answer evaluation flow
const EvaluateAnswerOutputSchema = z.object({
  isCorrect: z.boolean().describe('Whether the user\'s answer is correct.'),
  summary: z.string().describe('A brief summary or explanation of the correct answer in Hindi.'),
});
export type EvaluateAnswerOutput = z.infer<typeof EvaluateAnswerOutputSchema>;

/**
 * Generates a batch of quiz questions.
 */
export async function generateQuestions(): Promise<QuizQuestion[]> {
  const result = await generateQuestionsFlow();
  return result.questions;
}

/**
 * Evaluates a user's quiz answer.
 */
export async function evaluateAnswer(input: EvaluateAnswerInput): Promise<EvaluateAnswerOutput> {
  return evaluateAnswerFlow(input);
}


const generateQuestionPrompt = ai.definePrompt({
  name: 'generateQuizQuestionsPrompt',
  output: { schema: QuestionsSchema },
  prompt: `You are an expert on Indian culture, traditions, and the Hindu Panchang. 
  Generate 10 unique, interesting, and engaging quiz questions in Hindi. 
  The questions should be suitable for a general audience.
  Ensure that each time you are called, you generate a completely new and different set of questions. Do not repeat questions from previous requests.
  Provide both the question and the correct answer for each.`,
});

const generateQuestionsFlow = ai.defineFlow(
  {
    name: 'generateQuestionsFlow',
    outputSchema: QuestionsSchema,
  },
  async () => {
    const { output } = await generateQuestionPrompt();
    return output!;
  }
);


const evaluateAnswerPrompt = ai.definePrompt({
    name: 'evaluateAnswerPrompt',
    input: { schema: EvaluateAnswerInputSchema },
    output: { schema: EvaluateAnswerOutputSchema },
    prompt: `You are an AI quiz master. Evaluate the user's answer to the given question.
    
    Question: {{{question}}}
    Correct Answer: {{{answer}}}
    User's Answer: {{{userAnswer}}}
    
    First, determine if the user's answer is correct. The user's answer may be slightly different but still convey the correct meaning. Be very lenient and forgiving with spelling, grammar, and phrasing. If the user's answer is semantically close to the correct answer, consider it correct. For example, if the correct answer is "नई दिल्ली" and the user says "दिल्ली", it should be marked as correct.
    
    Second, regardless of whether the answer is correct or not, provide a brief, interesting summary or explanation of the correct answer in a few words. This summary should be in clear and concise Hindi.

    Return the result in the specified JSON format.`,
});


const evaluateAnswerFlow = ai.defineFlow(
  {
    name: 'evaluateAnswerFlow',
    inputSchema: EvaluateAnswerInputSchema,
    outputSchema: EvaluateAnswerOutputSchema,
  },
  async (input) => {
    const { output } = await evaluateAnswerPrompt(input);
    return output!;
  }
);
