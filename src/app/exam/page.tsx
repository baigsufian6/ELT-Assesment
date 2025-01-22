'use client';

import { useEffect, useState } from 'react';
import { getQuestions } from '@/lib/questions';
import { Question, ExamState } from '@/types';
import { ExamTimer } from '@/components/ExamTimer';
import { QuestionNav } from '@/components/QuestionNav';
import { QuestionCard } from '@/components/QuestionCard';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [examState, setExamState] = useState<ExamState>({
    currentQuestion: 'q1',
    answers: {},
    flagged: [],
    timeRemaining: 3600, // 1 hour in seconds
    isSubmitted: false,
  });

  useEffect(() => {
    const loadQuestions = async () => {
      const data = await getQuestions();
      setQuestions(data);
      setLoading(false);
    };

    loadQuestions();
  }, []);

  const handleAnswerSelect = (questionId: string, answerId: string) => {
    setExamState((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: answerId,
      },
    }));
  };

  const handleQuestionSelect = (questionId: string) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestion: questionId,
    }));
  };

  const handleFlagQuestion = (questionId: string) => {
    setExamState((prev) => ({
      ...prev,
      flagged: prev.flagged.includes(questionId)
        ? prev.flagged.filter((id) => id !== questionId)
        : [...prev.flagged, questionId],
    }));
  };

  const handleTimeUp = () => {
    // Automatically submit when time is up
    handleSubmit();
  };

  const handleSubmit = () => {
    const answeredCount = Object.keys(examState.answers).length;
    if (answeredCount < questions.length * 0.5) {
      alert('Please answer at least 50% of the questions before submitting.');
      return;
    }
    
    router.push('/exam/results');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  const currentQuestion = questions.find(q => q.id === examState.currentQuestion);
  const currentIndex = questions.findIndex(q => q.id === examState.currentQuestion);

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-6">
        <ExamTimer duration={60} onTimeUp={handleTimeUp} />
        <Button 
          onClick={handleSubmit}
          disabled={Object.keys(examState.answers).length < questions.length * 0.5}
        >
          End and Submit
        </Button>
      </div>

      <QuestionNav
        questions={questions}
        currentQuestion={examState.currentQuestion}
        answeredQuestions={Object.keys(examState.answers)}
        flaggedQuestions={examState.flagged}
        onQuestionSelect={handleQuestionSelect}
        onFlagQuestion={handleFlagQuestion}
      />

      {currentQuestion && (
        <div className="mt-6">
          <QuestionCard
            question={currentQuestion}
            selectedAnswer={examState.answers[currentQuestion.id]}
            onAnswerSelect={handleAnswerSelect}
            onNext={() => handleQuestionSelect(questions[currentIndex + 1]?.id)}
            onPrevious={() => handleQuestionSelect(questions[currentIndex - 1]?.id)}
            onFlag={() => handleFlagQuestion(currentQuestion.id)}
            isFlagged={examState.flagged.includes(currentQuestion.id)}
            isFirst={currentIndex === 0}
            isLast={currentIndex === questions.length - 1}
            questionNumber={currentIndex + 1}
          />
        </div>
      )}
    </main>
  );
}