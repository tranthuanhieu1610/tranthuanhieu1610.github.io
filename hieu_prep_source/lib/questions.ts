import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { Question, QuestionType, DifficultyLevel, QuestionContent } from '@/types/question';

const QUESTIONS_COLLECTION = 'questions';

// Create a new question
export async function createQuestion(
  questionData: {
    type: QuestionType;
    section: string;
    difficulty: DifficultyLevel;
    content: QuestionContent;
    tags: string[];
    source: string;
    desmosRequired: boolean;
    createdBy: string;
  }
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, QUESTIONS_COLLECTION), {
      ...questionData,
      attemptCount: 0,
      correctRate: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: any) {
    console.error('Error creating question:', error);
    throw new Error(error.message || 'Failed to create question');
  }
}

// Get all questions
export async function getAllQuestions(): Promise<Question[]> {
  try {
    const querySnapshot = await getDocs(
      query(collection(db, QUESTIONS_COLLECTION), orderBy('createdAt', 'desc'))
    );

    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Question);
    });

    return questions;
  } catch (error: any) {
    console.error('Error getting questions:', error);
    throw new Error(error.message || 'Failed to get questions');
  }
}

// Get questions by type
export async function getQuestionsByType(type: QuestionType): Promise<Question[]> {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where('type', '==', type),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Question);
    });

    return questions;
  } catch (error: any) {
    console.error('Error getting questions by type:', error);
    throw new Error(error.message || 'Failed to get questions by type');
  }
}

// Get questions by difficulty
export async function getQuestionsByDifficulty(difficulty: DifficultyLevel): Promise<Question[]> {
  try {
    const q = query(
      collection(db, QUESTIONS_COLLECTION),
      where('difficulty', '==', difficulty),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);

    const questions: Question[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      questions.push({
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      } as Question);
    });

    return questions;
  } catch (error: any) {
    console.error('Error getting questions by difficulty:', error);
    throw new Error(error.message || 'Failed to get questions by difficulty');
  }
}

// Get a single question by ID
export async function getQuestionById(questionId: string): Promise<Question | null> {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate() || new Date(),
    } as Question;
  } catch (error: any) {
    console.error('Error getting question:', error);
    throw new Error(error.message || 'Failed to get question');
  }
}

// Update a question
export async function updateQuestion(
  questionId: string,
  updateData: Partial<Omit<Question, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error updating question:', error);
    throw new Error(error.message || 'Failed to update question');
  }
}

// Delete a question
export async function deleteQuestion(questionId: string): Promise<void> {
  try {
    const docRef = doc(db, QUESTIONS_COLLECTION, questionId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('Error deleting question:', error);
    throw new Error(error.message || 'Failed to delete question');
  }
}

// Search questions by keyword
export async function searchQuestions(keyword: string): Promise<Question[]> {
  try {
    // Note: This is a simple implementation. For production, consider using
    // Algolia, Meilisearch, or Firebase's full-text search extensions
    const allQuestions = await getAllQuestions();

    const lowerKeyword = keyword.toLowerCase();
    return allQuestions.filter((question) => {
      return (
        question.content.question.toLowerCase().includes(lowerKeyword) ||
        question.tags.some((tag) => tag.toLowerCase().includes(lowerKeyword)) ||
        question.section.toLowerCase().includes(lowerKeyword) ||
        (question.content.passage && question.content.passage.toLowerCase().includes(lowerKeyword))
      );
    });
  } catch (error: any) {
    console.error('Error searching questions:', error);
    throw new Error(error.message || 'Failed to search questions');
  }
}
