'use client';

import { Question } from '@/types';
import { Flag } from 'lucide-react';

interface QuestionNavProps {
  questions: Question[];
  currentQuestion: string;
  answeredQuestions: string[];
  flaggedQuestions: string[];
  onQuestionSelect: (id: string) => void;
  onFlagQuestion: (id: string) => void;
}

export function QuestionNav({
  questions,
  currentQuestion,
  answeredQuestions,
  flaggedQuestions,
  onQuestionSelect,
  onFlagQuestion,
}: QuestionNavProps) {
  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {questions.map((question) => {
        const isAnswered = answeredQuestions.includes(question.id);
        const isFlagged = flaggedQuestions.includes(question.id);
        const isCurrent = currentQuestion === question.id;

        // Manually construct the class string
        let buttonClasses = "w-10 h-10 rounded-full flex items-center justify-center relative";
        
        if (isAnswered) buttonClasses += " bg-green-500 text-white";
        if (isCurrent) buttonClasses += " ring-2 ring-blue-500";
        if (!isAnswered &&!isCurrent) buttonClasses += " bg-gray-200";

        return (
          <button
            key={question.id}
            onClick={() => onQuestionSelect(question.id)}
            className={buttonClasses}
          >
            {isFlagged && (
              <Flag 
                className="absolute -top-1 -right-1 w-4 h-4 text-orange-500" 
                onClick={(e) => {
                  e.stopPropagation();
                  onFlagQuestion(question.id);
                }}
              />
            )}
            {question.id.replace('q', '')}
          </button>
        );
      })}
    </div>
  );
}