"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getTeacherById, getReviewsForTeacher } from "@/lib/firebase-utils";
import { formatDate, getRatingBgColor } from "@/lib/utils";
import type { Teacher, Review } from "@/lib/types";

export default function TeacherProfile() {
  const params = useParams();
  const teacherId = params.id as string;

  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeacherData();
  }, [teacherId]);

  const loadTeacherData = async () => {
    try {
      setLoading(true);
      const [teacherData, reviewsData] = await Promise.all([
        getTeacherById(teacherId),
        getReviewsForTeacher(teacherId),
      ]);
      setTeacher(teacherData);
      setReviews(reviewsData);
    } catch (error) {
      console.error("Error loading teacher data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
        <p className="mt-4 text-gray-600">Loading teacher profile...</p>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Teacher Not Found</h2>
        <p className="text-gray-600 mb-6">
          The teacher you're looking for doesn't exist.
        </p>
        <a
          href="/rate-ams-teacher"
          className="text-[#4CAF50] hover:underline"
        >
          Back to Home
        </a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Teacher Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">{teacher.name}</h1>
            <p className="text-xl text-gray-600 mb-1">{teacher.subject}</p>
            <p className="text-lg text-gray-500">{teacher.department}</p>
          </div>

          {/* Rating Circle */}
          <div className="flex flex-col items-center">
            <div
              className={`${getRatingBgColor(
                teacher.avgRating
              )} text-white rounded-full w-24 h-24 flex items-center justify-center mb-2`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {teacher.avgRating.toFixed(1)}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600">Overall Rating</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-[#FFC107] mb-2">
              {teacher.avgDifficulty.toFixed(1)}
            </div>
            <div className="text-gray-600">Difficulty</div>
            <div className="text-xs text-gray-500 mt-1">out of 5</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-[#4CAF50] mb-2">
              {teacher.wouldTakeAgain}%
            </div>
            <div className="text-gray-600">Would Take Again</div>
          </div>

          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-[#2196F3] mb-2">
              {teacher.totalReviews}
            </div>
            <div className="text-gray-600">Total Reviews</div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-8 text-center">
          <a
            href={`/rate-ams-teacher/submit-review?teacher=${teacherId}`}
            className="inline-block bg-[#4CAF50] text-white px-8 py-3 rounded-lg text-lg font-medium hover:bg-[#45a049] transition-colors"
          >
            Rate This Teacher
          </a>
        </div>
      </div>

      {/* Reviews Section */}
      <div>
        <h2 className="text-2xl font-bold mb-6">
          Student Reviews ({reviews.length})
        </h2>

        {reviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No reviews yet. Be the first to review!
            </p>
            <a
              href={`/rate-ams-teacher/submit-review?teacher=${teacherId}`}
              className="text-[#4CAF50] hover:underline font-medium"
            >
              Write a Review
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Review Card Component
function ReviewCard({ review }: { review: Review }) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return "bg-[#4CAF50]";
    if (rating >= 3.5) return "bg-[#8BC34A]";
    if (rating >= 2.5) return "bg-[#FFC107]";
    if (rating >= 2.0) return "bg-[#FF9800]";
    return "bg-[#F44336]";
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div
              className={`${getRatingColor(
                review.rating
              )} text-white px-3 py-1 rounded-full text-sm font-bold`}
            >
              {review.rating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">
              Difficulty: {review.difficulty}/5
            </div>
            {review.wouldTakeAgain && (
              <div className="text-sm text-green-600 font-medium">
                ✓ Would take again
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {review.course} • {formatDate(review.timestamp)}
          </p>
        </div>
      </div>

      {/* Tags */}
      {review.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {review.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Comment */}
      {review.comment && (
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      )}
    </div>
  );
}
