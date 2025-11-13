export type UserRole = 'admin' | 'user';

export interface UserStats {
  totalQuestions: number;
  correctAnswers: number;
  averageScore: number;
  studyTime: number; // in minutes
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  stats: UserStats;
}
