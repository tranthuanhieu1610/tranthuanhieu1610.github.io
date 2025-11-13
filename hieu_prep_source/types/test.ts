import { QuestionType } from './question';

export interface TestSection {
  id: string;
  name: string;
  type: QuestionType;
  timeLimit: number; // in minutes
  questionIds: string[];
  calculatorAllowed: boolean;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  type: 'practice' | 'full_test' | 'module';
  sections: TestSection[];
  totalQuestions: number;
  totalDuration: number; // in minutes
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
}

export interface TestAnnotation {
  highlights: string[]; // highlighted text segments
  strikethroughs: string[]; // crossed-out option IDs (A, B, C, D)
  notes: string;
}

export interface UserAnswer {
  questionId: string;
  answer: string | null; // A, B, C, D, or null if unanswered
  timeSpent: number; // in seconds
  isMarkedForReview: boolean;
  annotations?: TestAnnotation;
}

export interface TestScore {
  total: number;
  correct: number;
  percentage: number;
  bySection?: {
    [sectionId: string]: {
      correct: number;
      total: number;
      score: number; // 200-800 for SAT sections
    };
  };
}

export type TestStatus = 'in_progress' | 'completed' | 'paused' | 'abandoned';

export interface UserTestSession {
  id: string;
  userId: string;
  testId: string;

  // Progress
  currentSectionIndex: number;
  currentQuestionIndex: number;

  // Timing
  startedAt: Date;
  completedAt?: Date;
  pausedAt?: Date;
  timeSpent: number; // in seconds
  sectionTimeRemaining: number[]; // remaining time for each section in seconds

  // Status and answers
  status: TestStatus;
  answers: UserAnswer[];

  // Results (only after completion)
  score?: TestScore;
}

export interface TestResult {
  id: string;
  userId: string;
  testId: string;
  sessionId: string;

  completedAt: Date;
  totalTimeSpent: number;

  score: TestScore;
  answers: UserAnswer[];

  // Analytics
  byDifficulty: {
    easy: { correct: number; total: number };
    medium: { correct: number; total: number };
    hard: { correct: number; total: number };
  };
}

export interface UserProgress {
  id: string;
  userId: string;
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  timeSpent: number; // in seconds
  bookmarked: boolean;
  attemptedAt: Date;
}
