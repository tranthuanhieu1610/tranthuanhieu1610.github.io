"use client";

import { useState } from "react";
import { REVIEW_TAGS } from "@/lib/types";
import type { ReviewFormData } from "@/lib/types";

// Mock teachers for demo
const mockTeachers = [
  { id: "1", name: "Nguyễn Văn Anh", subject: "Mathematics" },
  { id: "2", name: "Trần Thị Bích", subject: "Physics" },
  { id: "3", name: "Lê Minh Châu", subject: "Chemistry" },
  { id: "4", name: "Phạm Hoàng Dũng", subject: "Biology" },
];

export default function SubmitReview() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<ReviewFormData>({
    teacherId: "",
    rating: 0,
    difficulty: 0,
    wouldTakeAgain: false,
    course: "",
    tags: [],
    comment: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.teacherId) {
      setError("Please select a teacher");
      return;
    }
    if (formData.rating === 0) {
      setError("Please provide a rating");
      return;
    }
    if (formData.difficulty === 0) {
      setError("Please provide a difficulty rating");
      return;
    }
    if (!formData.course.trim()) {
      setError("Please enter the course name");
      return;
    }
    if (formData.tags.length === 0) {
      setError("Please select at least one tag");
      return;
    }
    if (formData.comment.length < 10) {
      setError("Comment must be at least 10 characters");
      return;
    }

    // Simulate submission
    setSubmitting(true);
    setTimeout(() => {
      setSuccess(true);
      setSubmitting(false);
    }, 1000);
  };

  const toggleTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  if (success) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-3xl font-bold mb-4 text-[#4CAF50]">
            Review Submitted!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for your feedback!
          </p>
          <a
            href="/rate-ams-teacher"
            className="inline-block bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-[#45a049]"
          >
            Back to Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Rate a Teacher</h1>
        <p className="text-gray-600 mb-8">
          Share your experience to help other students make informed decisions.
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {/* Teacher Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Teacher <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.teacherId}
              onChange={(e) =>
                setFormData({ ...formData, teacherId: e.target.value })
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              required
            >
              <option value="">Choose a teacher...</option>
              {mockTeachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} - {teacher.subject}
                </option>
              ))}
            </select>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Overall Rating <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className={`w-12 h-12 rounded-full font-bold transition-colors ${
                    formData.rating >= rating
                      ? "bg-[#4CAF50] text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Difficulty Level <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((difficulty) => (
                <button
                  key={difficulty}
                  type="button"
                  onClick={() => setFormData({ ...formData, difficulty })}
                  className={`w-12 h-12 rounded-full font-bold transition-colors ${
                    formData.difficulty >= difficulty
                      ? "bg-[#FFC107] text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              1 = Very Easy, 5 = Very Difficult
            </p>
          </div>

          {/* Would Take Again */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Would you take this teacher again?
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, wouldTakeAgain: true })}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  formData.wouldTakeAgain
                    ? "bg-[#4CAF50] text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, wouldTakeAgain: false })}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  !formData.wouldTakeAgain
                    ? "bg-[#F44336] text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
              >
                No
              </button>
            </div>
          </div>

          {/* Course */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Course/Class <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.course}
              onChange={(e) =>
                setFormData({ ...formData, course: e.target.value })
              }
              placeholder="e.g., Advanced Mathematics 11A"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              required
            />
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Select Tags <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {REVIEW_TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    formData.tags.includes(tag)
                      ? "bg-[#4CAF50] text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.comment}
              onChange={(e) =>
                setFormData({ ...formData, comment: e.target.value })
              }
              placeholder="Share your experience with this teacher..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50]"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum 10 characters ({formData.comment.length}/10)
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-[#4CAF50] text-white py-3 rounded-lg font-medium hover:bg-[#45a049] transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
            <a
              href="/rate-ams-teacher"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Cancel
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
