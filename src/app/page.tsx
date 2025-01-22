'use client';

import { useState, useEffect } from 'react';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle 
} from '@/components/ui/alert-dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getQuestions } from '@/lib/questions';

interface Option {
  id: string;
  option: string;
}

interface Question {
  id: string;
  question: string;
  options: Option[];
}

export default function ExamPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [flagged, setFlagged] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(3600); // 1 hour in seconds
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Keep all existing useEffects and handlers
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    } else {
      handleEndExam();
    }
  }, [timeLeft]);

  // Keep all existing handlers
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const handleAnswer = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: optionId }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleFlagQuestion = () => {
    setFlagged((prev) =>
      prev.includes(currentQuestion)
        ? prev.filter((q) => q !== currentQuestion)
        : [...prev, currentQuestion]
    );
  };

  const handleEndExam = () => {
    const answeredQuestions = Object.keys(answers).length;
    if (answeredQuestions >= questions.length * 0.5) {
      router.push('/exam/results');
    } else {
      alert('You need to answer at least 50% of the questions to end the exam.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - Updated styling */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-6">Overview</h2>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant="outline"
                className={`h-8 w-8 p-0 text-sm font-normal
                  ${currentQuestion === index ? 'bg-blue-500 text-white border-blue-500' : 'bg-black'}
                  ${answers[index] ? 'bg-gray-100' : ''}
                  ${flagged.includes(index) ? 'border-orange-400' : 'border-gray-200'}
                `}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Content - Updated styling */}
      <main className="ml-64 flex-1 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header - Updated styling */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-xl font-medium text-gray-900">MCQ-{String(currentQuestion + 1).padStart(2, '0')}</h1>
            <div className="text-sm text-gray-600">{formatTime(timeLeft)}</div>
          </div>

          {/* Question Card - Updated styling */}
          {questions[currentQuestion] && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <h2 className="text-base text-gray-900 mb-6">{questions[currentQuestion].question}</h2>
              <div className="space-y-3">
                {questions[currentQuestion].options.map((optionItem) => (
                  <label
                    key={optionItem.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors
                      ${answers[currentQuestion] === optionItem.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <input
                      type="radio"
                      name={`answer-${currentQuestion}`}
                      value={optionItem.id}
                      checked={answers[currentQuestion] === optionItem.id}
                      onChange={() => handleAnswer(optionItem.id)}
                      className="mr-3"
                    />
                    <span className="text-gray-700">{optionItem.option}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Navigation - Updated styling */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestion === 0}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4 mr-2" /> Previous
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleFlagQuestion}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                <Flag className={`h-4 w-4 mr-2 ${flagged.includes(currentQuestion) ? 'text-orange-400' : ''}`} />
                Flag
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowEndDialog(true)}
                disabled={Object.keys(answers).length < questions.length * 0.5}
                className="text-gray-600 border-gray-200 hover:bg-gray-50"
              >
                End and Submit
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleNextQuestion}
              disabled={currentQuestion === questions.length - 1}
              className="text-gray-600 border-gray-200 hover:bg-gray-50"
            >
              Next <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>

      {/* Alert Dialog - Updated styling */}
      <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <AlertDialogContent className="bg-white p-6 rounded-lg max-w-md mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-medium text-gray-900">End Exam?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to end the exam? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleEndExam}
              className="bg-blue-500 text-white hover:bg-blue-600 rounded-md px-4 py-2"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}