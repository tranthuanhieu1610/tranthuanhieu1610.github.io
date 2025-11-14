// Teacher interface
export interface Teacher {
  id: string;
  name: string;
  subject: string;
  department: string;
  avgRating: number;
  avgDifficulty: number;
  wouldTakeAgain: number; // Percentage (0-100)
  totalReviews: number;
  createdAt: Date;
}

// Review interface
export interface Review {
  id: string;
  teacherId: string;
  rating: number; // 1-5
  difficulty: number; // 1-5
  wouldTakeAgain: boolean;
  course: string;
  tags: string[];
  comment: string;
  timestamp: Date;
}

// Form data for submitting a review
export interface ReviewFormData {
  teacherId: string;
  rating: number;
  difficulty: number;
  wouldTakeAgain: boolean;
  course: string;
  tags: string[];
  comment: string;
}

// Available tags for reviews
export const REVIEW_TAGS = [
  "Gives lots of homework",
  "Engaging",
  "Strict",
  "Helpful",
  "Clear explanations",
  "Tough grader",
  "Caring",
  "Accessible outside class",
  "Inspiring",
  "Skip class? You won't pass",
  "Amazing lectures",
  "Participation matters",
  "Get ready to read",
  "Test heavy",
  "Group projects",
] as const;

export type ReviewTag = typeof REVIEW_TAGS[number];

// Departments/subjects
export const DEPARTMENTS = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Literature",
  "English",
  "History",
  "Geography",
  "Computer Science",
  "Physical Education",
  "Art",
  "Music",
] as const;

export type Department = typeof DEPARTMENTS[number];
