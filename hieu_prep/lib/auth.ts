import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { User, UserRole } from '@/types';

/**
 * Register a new user
 */
export const registerUser = async (
  email: string,
  password: string,
  name: string,
  role: UserRole = 'user'
): Promise<User> => {
  try {
    // Create Firebase auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update profile with display name
    await updateProfile(firebaseUser, { displayName: name });

    // Create user document in Firestore
    const newUser: User = {
      id: firebaseUser.uid,
      email: firebaseUser.email!,
      name,
      role,
      createdAt: new Date(),
      stats: {
        totalQuestions: 0,
        correctAnswers: 0,
        averageScore: 0,
        studyTime: 0,
      },
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), newUser);

    return newUser;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to register user');
  }
};

/**
 * Sign in existing user
 */
export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Fetch user data from Firestore
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }

    return userDoc.data() as User;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

/**
 * Sign out current user
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to send reset email');
  }
};

/**
 * Get user data from Firestore
 */
export const getUserData = async (uid: string): Promise<User | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user data');
  }
};
