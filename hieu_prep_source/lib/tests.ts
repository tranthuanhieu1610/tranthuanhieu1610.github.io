import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  addDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import { Test, UserTestSession, TestResult, UserAnswer, TestScore } from '@/types/test';
import { Question } from '@/types/question';
import { getQuestionById } from './questions';

// Get all published tests
export async function getAllTests(): Promise<Test[]> {
  try {
    const testsRef = collection(db, 'tests');
    const q = query(testsRef, where('isPublished', '==', true), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Test;
    });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return [];
  }
}

// Get a single test by ID
export async function getTestById(testId: string): Promise<Test | null> {
  try {
    const testRef = doc(db, 'tests', testId);
    const testSnap = await getDoc(testRef);

    if (!testSnap.exists()) {
      return null;
    }

    const data = testSnap.data();
    return {
      ...data,
      id: testSnap.id,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Test;
  } catch (error) {
    console.error('Error fetching test:', error);
    return null;
  }
}

// Create a new test session
export async function createTestSession(userId: string, testId: string): Promise<string> {
  try {
    const test = await getTestById(testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // Initialize section time remaining
    const sectionTimeRemaining = test.sections.map((section) => section.timeLimit * 60);

    const session: Omit<UserTestSession, 'id'> = {
      userId,
      testId,
      currentSectionIndex: 0,
      currentQuestionIndex: 0,
      startedAt: new Date(),
      timeSpent: 0,
      sectionTimeRemaining,
      status: 'in_progress',
      answers: [],
    };

    const sessionsRef = collection(db, 'test_sessions');
    const docRef = await addDoc(sessionsRef, {
      ...session,
      startedAt: Timestamp.fromDate(session.startedAt),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating test session:', error);
    throw error;
  }
}

// Get a test session
export async function getTestSession(sessionId: string): Promise<UserTestSession | null> {
  try {
    const sessionRef = doc(db, 'test_sessions', sessionId);
    const sessionSnap = await getDoc(sessionRef);

    if (!sessionSnap.exists()) {
      return null;
    }

    const data = sessionSnap.data();
    return {
      ...data,
      id: sessionSnap.id,
      startedAt: data.startedAt?.toDate() || new Date(),
      completedAt: data.completedAt?.toDate(),
      pausedAt: data.pausedAt?.toDate(),
    } as UserTestSession;
  } catch (error) {
    console.error('Error fetching test session:', error);
    return null;
  }
}

// Get user's test sessions
export async function getUserTestSessions(userId: string): Promise<UserTestSession[]> {
  try {
    const sessionsRef = collection(db, 'test_sessions');
    const q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('startedAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        startedAt: data.startedAt?.toDate() || new Date(),
        completedAt: data.completedAt?.toDate(),
        pausedAt: data.pausedAt?.toDate(),
      } as UserTestSession;
    });
  } catch (error) {
    console.error('Error fetching user test sessions:', error);
    return [];
  }
}

// Update test session progress
export async function updateTestSession(
  sessionId: string,
  updates: Partial<UserTestSession>
): Promise<void> {
  try {
    const sessionRef = doc(db, 'test_sessions', sessionId);
    const updateData: any = { ...updates };

    // Convert dates to Firestore timestamps
    if (updates.pausedAt) {
      updateData.pausedAt = Timestamp.fromDate(updates.pausedAt);
    }
    if (updates.completedAt) {
      updateData.completedAt = Timestamp.fromDate(updates.completedAt);
    }

    await updateDoc(sessionRef, updateData);
  } catch (error) {
    console.error('Error updating test session:', error);
    throw error;
  }
}

// Save answer for a question
export async function saveAnswer(
  sessionId: string,
  answer: UserAnswer
): Promise<void> {
  try {
    const session = await getTestSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    // Find existing answer or add new one
    const existingIndex = session.answers.findIndex((a) => a.questionId === answer.questionId);

    if (existingIndex >= 0) {
      session.answers[existingIndex] = answer;
    } else {
      session.answers.push(answer);
    }

    await updateTestSession(sessionId, { answers: session.answers });
  } catch (error) {
    console.error('Error saving answer:', error);
    throw error;
  }
}

// Calculate SAT score (simplified conversion)
function calculateSATScore(correct: number, total: number): number {
  const percentage = total > 0 ? correct / total : 0;

  // Simplified SAT scoring curve
  // Real SAT uses complex equating, this is approximate
  if (percentage >= 0.95) return 800;
  if (percentage >= 0.90) return 780;
  if (percentage >= 0.85) return 750;
  if (percentage >= 0.80) return 720;
  if (percentage >= 0.75) return 690;
  if (percentage >= 0.70) return 660;
  if (percentage >= 0.65) return 630;
  if (percentage >= 0.60) return 600;
  if (percentage >= 0.55) return 570;
  if (percentage >= 0.50) return 540;
  if (percentage >= 0.45) return 510;
  if (percentage >= 0.40) return 480;
  if (percentage >= 0.35) return 450;
  if (percentage >= 0.30) return 420;
  if (percentage >= 0.25) return 390;
  if (percentage >= 0.20) return 360;
  if (percentage >= 0.15) return 330;
  if (percentage >= 0.10) return 300;
  if (percentage >= 0.05) return 250;
  return 200;
}

// Complete test and calculate score
export async function completeTest(sessionId: string): Promise<TestResult> {
  try {
    const session = await getTestSession(sessionId);
    if (!session) {
      throw new Error('Session not found');
    }

    const test = await getTestById(session.testId);
    if (!test) {
      throw new Error('Test not found');
    }

    // Load all questions to check answers
    const questions: Question[] = [];
    for (const section of test.sections) {
      for (const questionId of section.questionIds) {
        const question = await getQuestionById(questionId);
        if (question) {
          questions.push(question);
        }
      }
    }

    // Calculate scores
    let totalCorrect = 0;
    let totalQuestions = questions.length;
    const byDifficulty = {
      easy: { correct: 0, total: 0 },
      medium: { correct: 0, total: 0 },
      hard: { correct: 0, total: 0 },
    };

    const bySection: { [key: string]: { correct: number; total: number; score: number } } = {};

    for (const section of test.sections) {
      let sectionCorrect = 0;
      let sectionTotal = 0;

      for (const questionId of section.questionIds) {
        const question = questions.find((q) => q.id === questionId);
        if (!question) continue;

        const userAnswer = session.answers.find((a) => a.questionId === questionId);
        const isCorrect = userAnswer?.answer === question.content.correctAnswer;

        if (isCorrect) {
          totalCorrect++;
          sectionCorrect++;
        }

        sectionTotal++;
        byDifficulty[question.difficulty].total++;
        if (isCorrect) {
          byDifficulty[question.difficulty].correct++;
        }
      }

      bySection[section.id] = {
        correct: sectionCorrect,
        total: sectionTotal,
        score: calculateSATScore(sectionCorrect, sectionTotal),
      };
    }

    const score: TestScore = {
      total: totalCorrect,
      correct: totalCorrect,
      percentage: totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0,
      bySection,
    };

    // Update session
    await updateTestSession(sessionId, {
      status: 'completed',
      completedAt: new Date(),
      score,
    });

    // Create test result
    const result: Omit<TestResult, 'id'> = {
      userId: session.userId,
      testId: session.testId,
      sessionId,
      completedAt: new Date(),
      totalTimeSpent: session.timeSpent,
      score,
      answers: session.answers,
      byDifficulty,
    };

    const resultsRef = collection(db, 'test_results');
    const resultDoc = await addDoc(resultsRef, {
      ...result,
      completedAt: Timestamp.fromDate(result.completedAt),
    });

    return {
      ...result,
      id: resultDoc.id,
    };
  } catch (error) {
    console.error('Error completing test:', error);
    throw error;
  }
}

// Get user's test results
export async function getUserTestResults(userId: string): Promise<TestResult[]> {
  try {
    const resultsRef = collection(db, 'test_results');
    const q = query(
      resultsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc')
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        completedAt: data.completedAt?.toDate() || new Date(),
      } as TestResult;
    });
  } catch (error) {
    console.error('Error fetching user test results:', error);
    return [];
  }
}
