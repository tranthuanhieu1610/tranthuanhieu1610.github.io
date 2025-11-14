import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Get color based on rating value
 * Green: 4.0-5.0 (excellent)
 * Light Green: 3.5-3.9 (good)
 * Yellow: 2.5-3.4 (average)
 * Orange: 2.0-2.4 (poor)
 * Red: 1.0-1.9 (bad)
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.0) return "rating-excellent";
  if (rating >= 3.5) return "rating-good";
  if (rating >= 2.5) return "rating-average";
  if (rating >= 2.0) return "rating-poor";
  return "rating-bad";
}

/**
 * Get background color class based on rating
 */
export function getRatingBgColor(rating: number): string {
  if (rating >= 4.0) return "bg-[#4CAF50]";
  if (rating >= 3.5) return "bg-[#8BC34A]";
  if (rating >= 2.5) return "bg-[#FFC107]";
  if (rating >= 2.0) return "bg-[#FF9800]";
  return "bg-[#F44336]";
}

/**
 * Get text color class based on rating
 */
export function getRatingTextColor(rating: number): string {
  if (rating >= 4.0) return "text-[#4CAF50]";
  if (rating >= 3.5) return "text-[#8BC34A]";
  if (rating >= 2.5) return "text-[#FFC107]";
  if (rating >= 2.0) return "text-[#FF9800]";
  return "text-[#F44336]";
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

/**
 * Format rating to one decimal place
 */
export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

/**
 * Calculate average from array of numbers
 */
export function calculateAverage(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
}

/**
 * Calculate percentage
 */
export function calculatePercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}
