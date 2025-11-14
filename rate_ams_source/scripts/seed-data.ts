/**
 * Seed Data Script
 * This script populates the Firestore database with initial teacher data
 * Run this once to set up your database with sample teachers
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// You'll need to replace these with your actual Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Sample teachers data
const teachers = [
  {
    name: "Nguyễn Văn Anh",
    subject: "Mathematics",
    department: "Mathematics",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Trần Thị Bích",
    subject: "Physics",
    department: "Physics",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Lê Minh Châu",
    subject: "Chemistry",
    department: "Chemistry",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Phạm Hoàng Dũng",
    subject: "Biology",
    department: "Biology",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Hoàng Thị Hoa",
    subject: "Literature",
    department: "Literature",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Đỗ Văn Khoa",
    subject: "English",
    department: "English",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Vũ Thị Lan",
    subject: "History",
    department: "History",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Bùi Minh Tuấn",
    subject: "Geography",
    department: "Geography",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Ngô Thị Mai",
    subject: "Computer Science",
    department: "Computer Science",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Đinh Văn Nam",
    subject: "Physical Education",
    department: "Physical Education",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Trịnh Thị Oanh",
    subject: "Art",
    department: "Art",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
  {
    name: "Phan Văn Phúc",
    subject: "Music",
    department: "Music",
    avgRating: 0,
    avgDifficulty: 0,
    wouldTakeAgain: 0,
    totalReviews: 0,
    createdAt: Timestamp.now(),
  },
];

async function seedDatabase() {
  console.log("Starting to seed database...");

  try {
    const teachersCollection = collection(db, "teachers");

    for (const teacher of teachers) {
      const docRef = await addDoc(teachersCollection, teacher);
      console.log(`Added teacher: ${teacher.name} with ID: ${docRef.id}`);
    }

    console.log("✅ Database seeded successfully!");
    console.log(`Total teachers added: ${teachers.length}`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

// Run the seed function
seedDatabase();
