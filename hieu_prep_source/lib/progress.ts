import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { UserAttempt, UserProgress } from '@/types/progress';
import { QuestionType, DifficultyLevel } from '@/types/question';

const ATTEMPTS_COLLECTION = 'attempts';
const PROGRESS_COLLECTION = 'progress';

// Record a question attempt
export async function recordAttempt(
  userId: string,
  questionId: string,
  selectedAnswer: string,
  isCorrect: boolean,
  timeSpent: number,
  questionType: QuestionType,
  difficulty: DifficultyLevel
): Promise<string> {
  try {
    // Save attempt
    const attemptRef = await addDoc(collection(db, ATTEMPTS_COLLECTION), {
      userId,
      questionId,
      selectedAnswer,
      isCorrect,
      timeSpent,
      attemptedAt: serverTimestamp(),
    });

    // Update user progress
    await updateUserProgress(userId, questionType, difficulty, isCorrect, timeSpent);

    return attemptRef.id;
  } catch (error: any) {
    console.error('Error recording attempt:', error);
    throw new Error(error.message || 'Failed to record attempt');
  }
}

// Update user progress stats
async function updateUserProgress(
  userId: string,
  questionType: QuestionType,
  difficulty: DifficultyLevel,
  isCorrect: boolean,
  timeSpent: number
): Promise<void> {
  try {
    const progressRef = doc(db, PROGRESS_COLLECTION, userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      // Create initial progress
      const initialProgress: Omit<UserProgress, 'id'> = {
        userId,
        totalQuestions: 1,
        correctAnswers: isCorrect ? 1 : 0,
        totalAttempts: 1,
        studyTime: Math.round(timeSpent / 60),
        lastPracticeDate: new Date(),
        streakDays: 1,
        byType: {
          reading: { total: 0, correct: 0 },
          writing: { total: 0, correct: 0 },
          math_no_calc: { total: 0, correct: 0 },
          math_calc: { total: 0, correct: 0 },
        },
        byDifficulty: {
          easy: { total: 0, correct: 0 },
          medium: { total: 0, correct: 0 },
          hard: { total: 0, correct: 0 },
        },
      };

      initialProgress.byType[questionType] = { total: 1, correct: isCorrect ? 1 : 0 };
      initialProgress.byDifficulty[difficulty] = { total: 1, correct: isCorrect ? 1 : 0 };

      await updateDoc(progressRef, initialProgress as any);
    } else {
      // Update existing progress
      const currentProgress = progressSnap.data();

      const updates: any = {
        totalQuestions: (currentProgress.totalQuestions || 0) + 1,
        correctAnswers: (currentProgress.correctAnswers || 0) + (isCorrect ? 1 : 0),
        totalAttempts: (currentProgress.totalAttempts || 0) + 1,
        studyTime: (currentProgress.studyTime || 0) + Math.round(timeSpent / 60),
        lastPracticeDate: new Date(),
      };

      // Update by type
      const typeKey = `byType.${questionType}`;
      updates[`${typeKey}.total`] = (currentProgress.byType?.[questionType]?.total || 0) + 1;
      updates[`${typeKey}.correct`] =
        (currentProgress.byType?.[questionType]?.correct || 0) + (isCorrect ? 1 : 0);

      // Update by difficulty
      const diffKey = `byDifficulty.${difficulty}`;
      updates[`${diffKey}.total`] =
        (currentProgress.byDifficulty?.[difficulty]?.total || 0) + 1;
      updates[`${diffKey}.correct`] =
        (currentProgress.byDifficulty?.[difficulty]?.correct || 0) + (isCorrect ? 1 : 0);

      await updateDoc(progressRef, updates);
    }
  } catch (error: any) {
    console.error('Error updating progress:', error);
    throw new Error(error.message || 'Failed to update progress');
  }
}

// Get user progress
export async function getUserProgress(userId: string): Promise<UserProgress | null> {
  try {
    const progressRef = doc(db, PROGRESS_COLLECTION, userId);
    const progressSnap = await getDoc(progressRef);

    if (!progressSnap.exists()) {
      return null;
    }

    const data = progressSnap.data();
    return {
      id: progressSnap.id,
      ...data,
      lastPracticeDate: data.lastPracticeDate?.toDate() || new Date(),
    } as UserProgress;
  } catch (error: any) {
    console.error('Error getting progress:', error);
    throw new Error(error.message || 'Failed to get progress');
  }
}

// Get user attempts for a question
export async function getUserAttempts(
  userId: string,
  questionId?: string
): Promise<UserAttempt[]> {
  try {
    let q = query(
      collection(db, ATTEMPTS_COLLECTION),
      where('userId', '==', userId),
      orderBy('attemptedAt', 'desc'),
      limit(100)
    );

    if (questionId) {
      q = query(
        collection(db, ATTEMPTS_COLLECTION),
        where('userId', '==', userId),
        where('questionId', '==', questionId),
        orderBy('attemptedAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);

    const attempts: UserAttempt[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      attempts.push({
        id: doc.id,
        ...data,
        attemptedAt: data.attemptedAt?.toDate() || new Date(),
      } as UserAttempt);
    });

    return attempts;
  } catch (error: any) {
    console.error('Error getting attempts:', error);
    throw new Error(error.message || 'Failed to get attempts');
  }
}

// Check if user has attempted a question
export async function hasAttemptedQuestion(
  userId: string,
  questionId: string
): Promise<boolean> {
  try {
    const attempts = await getUserAttempts(userId, questionId);
    return attempts.length > 0;
  } catch (error) {
    return false;
  }
}

// Get user's last attempt for a question
export async function getLastAttempt(
  userId: string,
  questionId: string
): Promise<UserAttempt | null> {
  try {
    const attempts = await getUserAttempts(userId, questionId);
    return attempts.length > 0 ? attempts[0] : null;
  } catch (error) {
    return null;
  }
}
