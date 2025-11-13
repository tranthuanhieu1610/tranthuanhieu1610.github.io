'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, Target, Clock, TrendingUp, BookOpen, CheckCircle2, XCircle } from 'lucide-react';
import { getUserProgress, getUserAttempts } from '@/lib/progress';
import { UserProgress, UserAttempt } from '@/types/progress';

export default function ProgressPage() {
  const { user } = useAuth();
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [recentAttempts, setRecentAttempts] = useState<UserAttempt[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadProgress();
    }
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [progressData, attemptsData] = await Promise.all([
        getUserProgress(user.id),
        getUserAttempts(user.id),
      ]);

      setProgress(progressData);
      setRecentAttempts(attemptsData.slice(0, 10));
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Loading your progress...</p>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  const accuracy = progress
    ? Math.round((progress.correctAnswers / progress.totalQuestions) * 100)
    : 0;

  const overallStats = [
    {
      label: 'Questions Practiced',
      value: progress?.totalQuestions || 0,
      icon: BookOpen,
      color: 'text-blue-600',
    },
    {
      label: 'Correct Answers',
      value: progress?.correctAnswers || 0,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      label: 'Accuracy',
      value: `${accuracy}%`,
      icon: Target,
      color: 'text-purple-600',
    },
    {
      label: 'Study Time',
      value: `${progress?.studyTime || 0}m`,
      icon: Clock,
      color: 'text-orange-600',
    },
  ];

  const typeProgress = progress
    ? [
        { name: 'Reading', ...progress.byType.reading },
        { name: 'Writing', ...progress.byType.writing },
        { name: 'Math (No Calc)', ...progress.byType.math_no_calc },
        { name: 'Math (Calc)', ...progress.byType.math_calc },
      ]
    : [];

  const difficultyProgress = progress
    ? [
        { name: 'Easy', ...progress.byDifficulty.easy, color: 'bg-green-100 text-green-800' },
        { name: 'Medium', ...progress.byDifficulty.medium, color: 'bg-yellow-100 text-yellow-800' },
        { name: 'Hard', ...progress.byDifficulty.hard, color: 'bg-red-100 text-red-800' },
      ]
    : [];

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container py-12 space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold">Your Progress</h1>
            <p className="text-muted-foreground mt-2">
              Track your SAT practice performance and improvement
            </p>
          </div>

          {progress ? (
            <>
              {/* Overall Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {overallStats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <Card key={stat.label}>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                        <Icon className={`h-4 w-4 ${stat.color}`} />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Progress by Type */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress by Question Type</CardTitle>
                  <CardDescription>See how you're performing in each section</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {typeProgress.map((type) => {
                      const typeAccuracy = type.total > 0
                        ? Math.round((type.correct / type.total) * 100)
                        : 0;

                      return (
                        <div key={type.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{type.name}</span>
                            <div className="text-sm text-muted-foreground">
                              {type.correct}/{type.total} correct ({typeAccuracy}%)
                            </div>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary transition-all"
                              style={{ width: `${typeAccuracy}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Progress by Difficulty */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress by Difficulty</CardTitle>
                  <CardDescription>Track your performance across difficulty levels</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {difficultyProgress.map((diff) => {
                      const diffAccuracy = diff.total > 0
                        ? Math.round((diff.correct / diff.total) * 100)
                        : 0;

                      return (
                        <Card key={diff.name} className="border-2">
                          <CardHeader className="pb-3">
                            <Badge className={diff.color}>{diff.name}</Badge>
                          </CardHeader>
                          <CardContent>
                            <div className="text-3xl font-bold mb-1">{diffAccuracy}%</div>
                            <div className="text-sm text-muted-foreground">
                              {diff.correct}/{diff.total} correct
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your last 10 practice attempts</CardDescription>
                </CardHeader>
                <CardContent>
                  {recentAttempts.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No practice activity yet. Start practicing to see your progress!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {recentAttempts.map((attempt) => (
                        <div
                          key={attempt.id}
                          className="flex items-center justify-between p-3 rounded-lg border"
                        >
                          <div className="flex items-center gap-3">
                            {attempt.isCorrect ? (
                              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                              </div>
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="h-5 w-5 text-red-600" />
                              </div>
                            )}
                            <div>
                              <div className="font-medium">
                                {attempt.isCorrect ? 'Correct' : 'Incorrect'}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {attempt.attemptedAt.toLocaleDateString()} •{' '}
                                {attempt.timeSpent}s
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline">Answer: {attempt.selectedAnswer}</Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            /* No Progress Yet */
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16">
                <Trophy className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Start Your SAT Journey</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  Begin practicing questions to track your progress and see your improvement over time.
                </p>
                <a
                  href="/practice"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-white hover:bg-primary/90"
                >
                  Start Practicing
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
