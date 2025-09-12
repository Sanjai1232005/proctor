'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface SampleExamProps {
    onSubmit: () => void;
}

const questions = [
  {
    id: 'q1',
    text: 'What is the capital of France?',
    options: [
      { id: 'q1o1', text: 'Berlin' },
      { id: 'q1o2', text: 'Madrid' },
      { id: 'q1o3', text: 'Paris' },
      { id: 'q1o4', text: 'Rome' },
    ],
  },
  {
    id: 'q2',
    text: 'Which planet is known as the Red Planet?',
    options: [
      { id: 'q2o1', text: 'Earth' },
      { id: 'q2o2', text: 'Mars' },
      { id: 'q2o3', text: 'Jupiter' },
      { id: 'q2o4', text: 'Venus' },
    ],
  },
  {
    id: 'q3',
    text: 'What is the largest mammal in the world?',
    options: [
      { id: 'q3o1', text: 'Elephant' },
      { id: 'q3o2', text: 'Blue Whale' },
      { id: 'q3o3', text: 'Giraffe' },
      { id: 'q3o4', text: 'Great White Shark' },
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
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Sample Exam</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {questions.map((question) => (
          <div key={question.id}>
            <p className="font-semibold mb-4">{question.text}</p>
            <RadioGroup
              value={answers[question.id]}
              onValueChange={(value) => handleAnswerChange(question.id, value)}
              className="space-y-2"
            >
              {question.options.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <Label htmlFor={option.id} className="font-normal">{option.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button onClick={onSubmit} className="w-full" disabled={!allQuestionsAnswered}>
          Submit Exam
        </Button>
      </CardFooter>
    </Card>
  );
}
