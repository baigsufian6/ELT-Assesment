export interface Question {
    id: string;
    question: string;
    options: Array<{ id: string; option: string }>;
  }
  
  export interface ExamState {
    currentQuestion: string;
    answers: Record<string, string>; // Changed to string keys
    flagged: string[]; // Changed to string IDs
    timeRemaining: number;
    isSubmitted: boolean;
  }