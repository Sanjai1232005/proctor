'use server';
/**
 * @fileOverview Analyzes a video frame for proctoring violations.
 *
 * - analyzeFrame - A function that analyzes a frame for suspicious activity.
 * - AnalyzeFrameInput - The input type for the analyzeFrame function.
 * - AnalyzeFrameOutput - The return type for the analyzeFrame function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeFrameInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a student taking an exam, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type AnalyzeFrameInput = z.infer<typeof AnalyzeFrameInputSchema>;

const AnalyzeFrameOutputSchema = z.object({
  isLookingAway: z.boolean().describe('True if the person is clearly not looking at the screen.'),
  prohibitedObjects: z.array(z.string()).describe('A list of detected objects that are not allowed, such as "mobile phone", "book", or "another person".'),
});
export type AnalyzeFrameOutput = z.infer<typeof AnalyzeFrameOutputSchema>;

export async function analyzeFrame(input: AnalyzeFrameInput): Promise<AnalyzeFrameOutput> {
  return analyzeFrameFlow(input);
}

const prompt = ai.definePrompt({
  name: 'proctoringFrameAnalyzer',
  input: {schema: AnalyzeFrameInputSchema},
  output: {schema: AnalyzeFrameOutputSchema},
  prompt: `You are an AI exam proctor. Analyze the provided image of a student taking an exam.

Determine if the student is looking away from the computer screen.
Also, identify any prohibited items or other people in the frame. Prohibited items include, but are not limited to, mobile phones, books, notes, headphones, or other electronic devices.

Based on this image: {{{media url=photoDataUri}}}

Provide a structured response indicating if the student is looking away and listing any prohibited objects or additional people you see.
`,
});

const analyzeFrameFlow = ai.defineFlow(
  {
    name: 'analyzeFrameFlow',
    inputSchema: AnalyzeFrameInputSchema,
    outputSchema: AnalyzeFrameOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
