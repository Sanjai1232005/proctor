'use server';
/**
 * @fileOverview Detects when a user switches tabs during the exam and warns them.
 *
 * - warnUserOnTabSwitch - A function that handles the tab switch detection process.
 * - WarnUserOnTabSwitchInput - The input type for the warnUserOnTabSwitch function.
 * - WarnUserOnTabSwitchOutput - The return type for the warnUserOnTabSwitch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WarnUserOnTabSwitchInputSchema = z.object({
  tabSwitchDetected: z
    .boolean()
    .describe('Whether a tab switch has been detected.'),
});
export type WarnUserOnTabSwitchInput = z.infer<typeof WarnUserOnTabSwitchInputSchema>;

const WarnUserOnTabSwitchOutputSchema = z.object({
  warningMessage: z
    .string()
    .describe(
      'A warning message to display to the user if a tab switch is detected.'
    ),
});
export type WarnUserOnTabSwitchOutput = z.infer<typeof WarnUserOnTabSwitchOutputSchema>;

export async function warnUserOnTabSwitch(input: WarnUserOnTabSwitchInput): Promise<WarnUserOnTabSwitchOutput> {
  return warnUserOnTabSwitchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'warnUserOnTabSwitchPrompt',
  input: {schema: WarnUserOnTabSwitchInputSchema},
  output: {schema: WarnUserOnTabSwitchOutputSchema},
  prompt: `You are a proctor overseeing an exam.

  A student has switched tabs during the exam. Generate a warning message to display to the user.

  Tab switch detected: {{{tabSwitchDetected}}}

  The warning message should be clear, concise, and firm, reminding the student of the exam rules and the consequences of cheating.
  `,
});

const warnUserOnTabSwitchFlow = ai.defineFlow(
  {
    name: 'warnUserOnTabSwitchFlow',
    inputSchema: WarnUserOnTabSwitchInputSchema,
    outputSchema: WarnUserOnTabSwitchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
