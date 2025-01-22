'use client';

import { Question } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: string;
  onAnswerSelect: (questionId: string, answerId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFlag: () => void;
  isFlagged: boolean;
  isFirst: boolean;
  isLast: boolean;
  questionNumber: number;
}

export function QuestionCard({
  question,
  selectedAnswer,
  onAnswerSelect,
  onNext,
  onPrevious,
  onFlag,
  isFlagged,
  isFirst,
  isLast,
  questionNumber,
}: QuestionCardProps) {
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl">
          MCQ-{questionNumber}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFlag}
          className={isFlagged ? 'text-orange-500' : ''}
        >
          <Flag className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-lg font-medium">{question.question}</div>
        
        <RadioGroup
          value={selectedAnswer}
          onValueChange={(value) => onAnswerSelect(question.id, value)}
          className="space-y-3"
        >
          {question.options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id}>{option.option}</Label>
            </div>
          ))}
        </RadioGroup>

        <div className="flex justify-between pt-4">
          <Button
            onClick={onPrevious}
            disabled={isFirst}
            variant="outline"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={onNext}
            disabled={isLast}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}