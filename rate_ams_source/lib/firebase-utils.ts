import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
  runTransaction,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Teacher, Review, ReviewFormData } from "./types";
import { calculateAverage, calculatePercentage } from "./utils";

// Collection references
const teachersCollection = collection(db, "teachers");
const reviewsCollection = collection(db, "reviews");

/**
 * Get all teachers
 */
export async function getAllTeachers(): Promise<Teacher[]> {
  try {
    const snapshot = await getDocs(teachersCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Teacher[];
  } catch (error) {
    console.error("Error fetching teachers:", error);
    throw error;
  }
}

/**
 * Get teacher by ID
 */
export async function getTeacherById(id: string): Promise<Teacher | null> {
  try {
    const docRef = doc(db, "teachers", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
      } as Teacher;
    }
    return null;
  } catch (error) {
    console.error("Error fetching teacher:", error);
    throw error;
  }
}

/**
 * Search teachers by name
 */
export async function searchTeachers(searchQuery: string): Promise<Teacher[]> {
  try {
    const allTeachers = await getAllTeachers();
    const searchLower = searchQuery.toLowerCase();

    return allTeachers.filter((teacher) =>
      teacher.name.toLowerCase().includes(searchLower)
    );
  } catch (error) {
    console.error("Error searching teachers:", error);
    throw error;
  }
}

/**
 * Filter teachers by subject/department
 */
export async function filterTeachersBySubject(
  subject: string
): Promise<Teacher[]> {
  try {
    const q = query(teachersCollection, where("subject", "==", subject));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate() || new Date(),
    })) as Teacher[];
  } catch (error) {
    console.error("Error filtering teachers:", error);
    throw error;
  }
}

/**
 * Get reviews for a teacher
 */
export async function getReviewsForTeacher(
  teacherId: string
): Promise<Review[]> {
  try {
    const q = query(
      reviewsCollection,
      where("teacherId", "==", teacherId),
      orderBy("timestamp", "desc")
    );
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || new Date(),
    })) as Review[];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

/**
 * Submit a new review and update teacher stats
 */
export async function submitReview(
  reviewData: ReviewFormData
): Promise<string> {
  try {
    // Use a transaction to ensure atomic updates
    const reviewId = await runTransaction(db, async (transaction) => {
      // Add the review
      const reviewRef = doc(reviewsCollection);
      transaction.set(reviewRef, {
        ...reviewData,
        timestamp: Timestamp.now(),
      });

      // Get current teacher data
      const teacherRef = doc(db, "teachers", reviewData.teacherId);
      const teacherDoc = await transaction.get(teacherRef);

      if (!teacherDoc.exists()) {
        throw new Error("Teacher not found");
      }

      // Get all reviews for this teacher (including the new one)
      const reviewsQuery = query(
        reviewsCollection,
        where("teacherId", "==", reviewData.teacherId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);

      // Calculate new averages
      const allRatings = [
        ...reviewsSnapshot.docs.map((doc) => doc.data().rating),
        reviewData.rating,
      ];
      const allDifficulties = [
        ...reviewsSnapshot.docs.map((doc) => doc.data().difficulty),
        reviewData.difficulty,
      ];
      const wouldTakeAgainCount = [
        ...reviewsSnapshot.docs.map((doc) => doc.data().wouldTakeAgain),
        reviewData.wouldTakeAgain,
      ].filter(Boolean).length;

      const totalReviews = allRatings.length;

      // Update teacher stats
      transaction.update(teacherRef, {
        avgRating: calculateAverage(allRatings),
        avgDifficulty: calculateAverage(allDifficulties),
        wouldTakeAgain: calculatePercentage(wouldTakeAgainCount, totalReviews),
        totalReviews,
      });

      return reviewRef.id;
    });

    return reviewId;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
}

/**
 * Create a new teacher (for admin/seeding purposes)
 */
export async function createTeacher(
  teacherData: Omit<Teacher, "id" | "createdAt">
): Promise<string> {
  try {
    const docRef = await addDoc(teachersCollection, {
      ...teacherData,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating teacher:", error);
    throw error;
  }
}
