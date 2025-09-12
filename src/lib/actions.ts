'use server';

import { warnUserOnTabSwitch } from '@/ai/flows/warn-user-on-tab-switch';
import { analyzeFrame, AnalyzeFrameInput, AnalyzeFrameOutput } from '@/ai/flows/analyze-proctoring-frame';

export async function getTabSwitchWarning(): Promise<string> {
  try {
    const result = await warnUserOnTabSwitch({ tabSwitchDetected: true });
    return result.warningMessage;
  } catch (error) {
    console.error('Error getting tab switch warning:', error);
    // Fallback message in case of AI flow failure
    return 'You have switched tabs or minimized the window. This action is against exam rules and has been logged. Please return to the exam immediately to avoid disqualification.';
  }
}

export async function analyzeFrameAction(input: AnalyzeFrameInput): Promise<AnalyzeFrameOutput> {
  return await analyzeFrame(input);
}
