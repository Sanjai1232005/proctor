
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChevronLeft, ChevronRight, Flag, FlagOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


interface SampleExamProps {
    onSubmit: () => void;
}

const questions = [
  {
    id: 'q1',
    text: 'A train moving at a constant speed of 72 km/h crosses a pole in 9 seconds and a platform in 29 seconds. What is the length of the platform?',
    options: [
      { id: 'q1o1', text: '300 meters' },
      { id: 'q1o2', text: '400 meters' },
      { id: 'q1o3', text: '500 meters' },
      { id: 'q1o4', text: '600 meters' },
    ],
  },
  {
    id: 'q2',
    text: 'What is the output of the following C code snippet?\n\n#include <stdio.h>\nint main() {\n    int i = 5;\n    printf("%d %d %d", i++, i, ++i);\n    return 0;\n}',
    options: [
      { id: 'q2o1', text: '5 6 7' },
      { id: 'q2o2', text: '7 6 5' },
      { id: 'q2o3', text: '6 6 7' },
      { id: 'q2o4', text: 'Undefined behavior' },
    ],
  },
  {
    id: 'q3',
    text: 'Which law of thermodynamics states that the entropy of any isolated system always increases?',
    options: [
      { id: 'q3o1', text: 'First Law of Thermodynamics' },
      { id: 'q3o2', text: 'Second Law of Thermodynamics' },
      { id: 'q3o3', text: 'Third Law of Thermodynamics' },
      { id: 'q3o4', text: 'Zeroth Law of Thermodynamics' },
    ],
  },
  {
    id: 'q4',
    text: 'In astrophysics, what is the Chandrasekhar Limit?',
    options: [
        { id: 'q4o1', text: 'The maximum speed a celestial body can achieve.' },
        { id: 'q4o2', text: 'The minimum temperature for nuclear fusion to start in a star.' },
        { id: 'q4o3', text: 'The maximum mass of a stable white dwarf star.' },
        { id: 'q4o4', text: 'The radius of a black hole\'s event horizon.' },
    ],
    },
    {
    id: 'q5',
    text: 'Identify the logical fallacy in the following statement: "You can\'t trust John\'s opinion on economics because he has never run a business."',
    options: [
        { id: 'q5o1', text: 'Straw Man' },
        { id: 'q5o2', text: 'Slippery Slope' },
        { id: 'q5o3', text: 'Ad Hominem' },
        { id: 'q5o4', text: 'Appeal to Authority' },
    ],
    },
];

export default function SampleExam({ onSubmit }: SampleExamProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleFlagToggle = (questionId: string) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  };

  const allQuestionsAnswered = questions.every((q) => answers[q.id]);
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <Card className="shadow-lg flex flex-col select-none">
      <CardHeader className="flex flex-row justify-between items-start">
        <div>
          <CardTitle className="text-2xl">Sample Exam</CardTitle>
          <CardDescription>Answer all questions to complete the exam.</CardDescription>
        </div>
        <div className="text-sm text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </CardHeader>
      
      <div className="flex flex-1 min-h-0">
        <aside className="w-1/4 p-4 border-r">
          <h3 className="font-semibold mb-4 text-center">Question Palette</h3>
          <ScrollArea className="h-[calc(100%-2rem)] pr-4">
            <div className="grid grid-cols-4 gap-2">
              {questions.map((q, index) => (
                <Button
                  key={q.id}
                  variant={currentQuestionIndex === index ? 'default' : answers[q.id] ? 'secondary' : 'outline'}
                  size="icon"
                  className={cn("h-9 w-9 relative", flagged[q.id] && "ring-2 ring-amber-500")}
                  onClick={() => goToQuestion(index)}
                >
                  {index + 1}
                  {flagged[q.id] && <Flag className="h-3 w-3 absolute -top-1 -right-1 fill-amber-500 text-amber-500"/>}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </aside>

        <div className="flex flex-col w-3/4">
          <ScrollArea className="flex-grow">
            <CardContent className="space-y-8 p-6">
                <div key={currentQuestion.id}>
                    <div className="flex justify-between items-start">
                        <p className="font-semibold mb-4 flex-1 pr-4">{currentQuestionIndex + 1}. {currentQuestion.text}</p>
                        <Button variant="ghost" size="icon" onClick={() => handleFlagToggle(currentQuestion.id)} title={flagged[currentQuestion.id] ? "Remove flag" : "Flag question"}>
                            {flagged[currentQuestion.id] ? <FlagOff className="h-5 w-5 text-amber-500" /> : <Flag className="h-5 w-5" />}
                        </Button>
                    </div>
                    <RadioGroup
                    value={answers[currentQuestion.id]}
                    onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                    className="space-y-3"
                    >
                    {currentQuestion.options.map((option) => (
                        <div key={option.id} className="flex items-center space-x-3 p-3 rounded-lg border has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-colors">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="font-normal text-base flex-1 cursor-pointer">{option.text}</Label>
                        </div>
                    ))}
                    </RadioGroup>
                </div>
            </CardContent>
          </ScrollArea>
          
          <CardFooter className="pt-6 flex-col items-stretch gap-4">
             <div className="flex justify-between">
                <Button onClick={() => goToQuestion(currentQuestionIndex - 1)} disabled={currentQuestionIndex === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4"/> Previous
                </Button>
                <Button onClick={() => goToQuestion(currentQuestionIndex + 1)} disabled={currentQuestionIndex === questions.length - 1}>
                    Next <ChevronRight className="ml-2 h-4 w-4"/>
                </Button>
            </div>
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="lg" className="w-full" disabled={!allQuestionsAnswered}>
                        Submit Exam
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have answered all questions. You will not be able to change your answers after submitting.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Review Answers</AlertDialogCancel>
                        <AlertDialogAction onClick={onSubmit}>Confirm Submission</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
}
