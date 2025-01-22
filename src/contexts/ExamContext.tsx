'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Question, ExamState } from '@/types';
import { getQuestions } from '@/lib/questions';

interface ExamContextType {
  state: ExamState;
  questions: Question[];
  loading: boolean;
  error: string | null;
  dispatch: React.Dispatch<ExamAction>;
}

type ExamAction =
  | { type: 'SET_ANSWER'; payload: { questionId: string; answerId: string } }
  | { type: 'SET_CURRENT_QUESTION'; payload: string }
  | { type: 'TOGGLE_FLAG'; payload: string }
  | { type: 'SET_QUESTIONS'; payload: Question[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'SUBMIT_EXAM' };

const initialState: ExamState = {
  currentQuestion: 'q1',
  answers: {},
  flagged: [],
  timeRemaining: 3600,
  isSubmitted: false,
};

const ExamContext = createContext<ExamContextType | undefined>(undefined);

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'SET_ANSWER':
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.payload.questionId]: action.payload.answerId,
        },
      };
    case 'SET_CURRENT_QUESTION':
      return {
        ...state,
        currentQuestion: action.payload,
      };
    case 'TOGGLE_FLAG':
      return {
        ...state,
        flagged: state.flagged.includes(action.payload)
          ? state.flagged.filter(id => id !== action.payload)
          : [...state.flagged, action.payload],
      };
    case 'SUBMIT_EXAM':
      return {
        ...state,
        isSubmitted: true,
      };
    default:
      return state;
  }
}

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const [questions, setQuestions] = React.useState<Question[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setLoading(true);
        const data = await getQuestions();
        setQuestions(data);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  return (
    <ExamContext.Provider value={{ state, questions, loading, error, dispatch }}>
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}