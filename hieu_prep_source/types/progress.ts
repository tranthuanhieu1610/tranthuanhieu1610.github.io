export interface UserAttempt {
  id: string;
  userId: string;
  questionId: string;
  selectedAnswer: string; // A, B, C, or D
  isCorrect: boolean;
  timeSpent: number; // in seconds
  attemptedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  totalQuestions: number;
  correctAnswers: number;
  totalAttempts: number;
  studyTime: number; // in minutes
  lastPracticeDate: Date;
  streakDays: number;
  byType: {
    reading: { total: number; correct: number };
    writing: { total: number; correct: number };
    math_no_calc: { total: number; correct: number };
    math_calc: { total: number; correct: number };
  };
  byDifficulty: {
    easy: { total: number; correct: number };
    medium: { total: number; correct: number };
    hard: { total: number; correct: number };
  };
}
