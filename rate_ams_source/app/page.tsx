"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getAllTeachers, searchTeachers } from "@/lib/firebase-utils";
import type { Teacher } from "@/lib/types";

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const data = await getAllTeachers();
      setTeachers(data);
      setFilteredTeachers(data);
    } catch (error) {
      console.error("Error loading teachers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setFilteredTeachers(teachers);
    } else {
      try {
        const results = await searchTeachers(query);
        setFilteredTeachers(results);
      } catch (error) {
        console.error("Error searching:", error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">
          Find Your Perfect Teacher
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Search and review teachers at Hanoi-Amsterdam High School
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for a teacher..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-[#4CAF50] mb-2">
            {teachers.length}
          </div>
          <div className="text-gray-600">Teachers</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-[#4CAF50] mb-2">
            {teachers.reduce((sum, t) => sum + t.totalReviews, 0)}
          </div>
          <div className="text-gray-600">Total Reviews</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-3xl font-bold text-[#4CAF50] mb-2">
            {teachers.length > 0
              ? (
                  teachers.reduce((sum, t) => sum + t.avgRating, 0) /
                  teachers.length
                ).toFixed(1)
              : "N/A"}
          </div>
          <div className="text-gray-600">Average Rating</div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-4">
          {searchQuery ? `Search Results (${filteredTeachers.length})` : "All Teachers"}
        </h3>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
          <p className="mt-4 text-gray-600">Loading teachers...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchQuery
              ? "No teachers found. Try a different search term."
              : "No teachers available yet."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeachers.map((teacher) => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      )}
    </div>
  );
}

// Teacher Card Component (will be moved to components folder later)
function TeacherCard({ teacher }: { teacher: Teacher }) {
  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return "bg-[#4CAF50]";
    if (rating >= 3.5) return "bg-[#8BC34A]";
    if (rating >= 2.5) return "bg-[#FFC107]";
    if (rating >= 2.0) return "bg-[#FF9800]";
    return "bg-[#F44336]";
  };

  return (
    <a
      href={`/rate-ams-teacher/teacher/${teacher.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="text-xl font-bold mb-1">{teacher.name}</h4>
          <p className="text-gray-600 text-sm">{teacher.subject}</p>
          <p className="text-gray-500 text-xs">{teacher.department}</p>
        </div>
        <div
          className={`${getRatingColor(
            teacher.avgRating
          )} text-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0`}
        >
          <div className="text-center">
            <div className="text-2xl font-bold">
              {teacher.avgRating.toFixed(1)}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Difficulty:</span>
          <span className="font-medium">{teacher.avgDifficulty.toFixed(1)}/5</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Would take again:</span>
          <span className="font-medium">{teacher.wouldTakeAgain}%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Reviews:</span>
          <span className="font-medium">{teacher.totalReviews}</span>
        </div>
      </div>
    </a>
  );
}
