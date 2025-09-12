'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SampleExamProps {
    onSubmit: () => void;
}

const questions = [
  {
    id: 'q1',
    text: 'In computer science, what does "NP" stand for in the context of complexity classes like NP-hard and NP-complete?',
    options: [
      { id: 'q1o1', text: 'Non-Polynomial' },
      { id: 'q1o2', text: 'Nondeterministic Polynomial time' },
      { id: 'q1o3', text: 'Negative-Positive' },
      { id: 'q1o4', text: 'Numerical Processing' },
    ],
  },
  {
    id: 'q2',
    text: 'What is the primary function of the ribosome in a biological cell?',
    options: [
      { id: 'q2o1', text: 'Energy production (ATP synthesis)' },
      { id: 'q2o2', text: 'Protein synthesis (translation)' },
      { id: 'q2o3', text: 'Storing genetic information' },
      { id: 'q2o4', text: 'Waste breakdown' },
    ],
  },
  {
    id: 'q3',
    text: 'Which of the following is NOT a fundamental force of nature according to the Standard Model of particle physics?',
    options: [
      { id: 'q3o1', text: 'Strong Nuclear Force' },
      { id: 'q3o2', text: 'Electromagnetism' },
      { id: 'q3o3', text: 'Gravity' },
      { id: 'q3o4', text: 'Centrifugal Force' },
    ],
  },
  {
    id: 'q4',
    text: 'The "Turing Test", developed by Alan Turing, is a test of a machine\'s ability to...',
    options: [
        { id: 'q4o1', text: 'Perform complex mathematical calculations faster than a human.' },
        { id: 'q4o2', text: 'Exhibit intelligent behavior equivalent to, or indistinguishable from, that of a human.' },
        { id: 'q4o3', text: 'Physically manipulate objects with human-like dexterity.' },
        { id: 'q4o4', text: 'Store more information than the human brain.' },
    ],
    },
    {
    id: 'q5',
    text: 'In Shakespeare\'s "Hamlet", what is the famous opening line of Hamlet\'s "To be or not to be" soliloquy?',
    options: [
        { id: 'q5o1', text: 'O, what a rogue and peasant slave am I!' },
        { id: 'q5o2', text: 'To be, or not to be, that is the question:' },
        { id: 'q5o3', text: 'Alas, poor Yorick! I knew him, Horatio:' },
        { id: 'q5o4', text: 'Get thee to a nunnery:' },
    ],
    },
];

export default function SampleExam({ onSubmit }: SampleExamProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };
  
  const allQuestionsAnswered = questions.every((q) => answers[q.id]);

  return (
    <Card className="h-full shadow-lg flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Sample Exam</CardTitle>
        <CardDescription>Answer all questions to complete the exam.</CardDescription>
      </CardHeader>
      <ScrollArea className="flex-grow">
        <CardContent className="space-y-8">
            {questions.map((question, index) => (
            <div key={question.id}>
                <p className="font-semibold mb-4">{index + 1}. {question.text}</p>
                <RadioGroup
                value={answers[question.id]}
                onValueChange={(value) => handleAnswerChange(question.id, value)}
                className="space-y-3"
                >
                {question.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                    <RadioGroupItem value={option.id} id={option.id} />
                    <Label htmlFor={option.id} className="font-normal text-base flex-1 cursor-pointer">{option.text}</Label>
                    </div>
                ))}
                </RadioGroup>
            </div>
            ))}
        </CardContent>
      </ScrollArea>
      <CardFooter className="pt-6">
        <Button onClick={onSubmit} size="lg" className="w-full" disabled={!allQuestionsAnswered}>
          Submit Exam
        </Button>
      </CardFooter>
    </Card>
  );
}
