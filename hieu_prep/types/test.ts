export interface TestSection {
  name: string;
  timeLimit: number; // in minutes
  questionIds: string[];
}

export interface Test {
  id: string;
  name: string;
  description: string;
  type: 'practice' | 'full_test' | 'module';
  sections: TestSection[];
  createdBy: string;
  createdAt: Date;
  isPublished: boolean;
}

export interface UserAnswer {
  questionId: string;
  answer: string;
  timeSpent: number; // in seconds
}

export interface TestScore {
  total: number;
  correct: number;
  percentage: number;
}

export type TestStatus = 'in_progress' | 'completed' | 'paused';

export interface UserTestSession {
  id: string;
  userId: string;
  testId: string;
  startedAt: Date;
  completedAt?: Date;
  status: TestStatus;
  answers: UserAnswer[];
  score?: TestScore;
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
