export type QuestionType = 'reading' | 'writing' | 'math_no_calc' | 'math_calc';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface QuestionOption {
  id: string; // A, B, C, D
  text: string; // markdown format
}

export interface QuestionContent {
  passage?: string; // markdown, optional for reading/writing
  question: string; // markdown
  options: QuestionOption[];
  images?: string[];
  correctAnswer: string; // A, B, C, or D
  explanation: string; // markdown
}

export interface Question {
  id: string;
  type: QuestionType;
  section: string;
  difficulty: DifficultyLevel;
  content: QuestionContent;
  tags: string[];
  source: string;
  desmosRequired: boolean;

  // Stats
  attemptCount: number;
  correctRate: number;

  // Metadata
  createdBy: string; // admin uid
  createdAt: Date;
  updatedAt: Date;
}
