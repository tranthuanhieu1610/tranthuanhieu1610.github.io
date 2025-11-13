'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  BookOpen,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { getTestById } from '@/lib/tests';
import { getQuestionById } from '@/lib/questions';
import { collection, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Test, TestResult } from '@/types/test';
import { Question } from '@/types/question';

function TestResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [result, setResult] = useState<TestResult | null>(null);
  const [test, setTest] = useState<Test | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, [searchParams, user]);

  const loadResults = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const resultId = searchParams.get('resultId');
      if (!resultId) {
        throw new Error('No result ID provided');
      }

      // Load result
      const resultRef = doc(db, 'test_results', resultId);
      const resultSnap = await getDoc(resultRef);

      if (!resultSnap.exists()) {
        throw new Error('Result not found');
      }

      const resultData = {
        ...resultSnap.data(),
        id: resultSnap.id,
        completedAt: resultSnap.data().completedAt?.toDate() || new Date(),
      } as TestResult;

      // Load test
      const testData = await getTestById(resultData.testId);
      if (!testData) {
        throw new Error('Test not found');
      }

      // Load questions
      const allQuestions: Question[] = [];
      for (const section of testData.sections) {
        for (const qId of section.questionIds) {
          const q = await getQuestionById(qId);
          if (q) allQuestions.push(q);
        }
      }

      setResult(resultData);
      setTest(testData);
      setQuestions(allQuestions);
    } catch (error) {
      console.error('Error loading results:', error);
      router.push('/tests');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 700) return 'text-green-600 dark:text-green-500';
    if (score >= 600) return 'text-blue-600 dark:text-blue-500';
    if (score >= 500) return 'text-yellow-600 dark:text-yellow-500';
    return 'text-orange-600 dark:text-orange-500';
  };

  if (loading || !result || !test) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const totalScore = Object.values(result.score.bySection || {}).reduce(
    (sum, section) => sum + section.score,
    0
  );

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push('/tests')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
        </div>

        {/* Overall score */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-3xl mb-2">{test.name}</CardTitle>
            <CardDescription>Completed {result.completedAt.toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                <span className={getScoreColor(totalScore)}>{totalScore}</span>
                <span className="text-3xl text-muted-foreground">/1600</span>
              </div>
              <p className="text-muted-foreground">Total SAT Score</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold">{result.score.correct}</span>
                </div>
                <p className="text-sm text-muted-foreground">Correct</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <XCircle className="h-5 w-5 text-red-600" />
                  <span className="text-2xl font-bold">
                    {result.score.total - result.score.correct}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">Incorrect</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{result.score.percentage.toFixed(1)}%</span>
                </div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-2xl font-bold">{formatTime(result.totalTimeSpent)}</span>
                </div>
                <p className="text-sm text-muted-foreground">Time</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section breakdown */}
        {result.score.bySection && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Section Scores</CardTitle>
              <CardDescription>Performance breakdown by test section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {test.sections.map((section) => {
                const sectionScore = result.score.bySection?.[section.id];
                if (!sectionScore) return null;

                const percentage =
                  sectionScore.total > 0
                    ? (sectionScore.correct / sectionScore.total) * 100
                    : 0;

                return (
                  <div key={section.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{section.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {sectionScore.correct} / {sectionScore.total} correct
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-3xl font-bold ${getScoreColor(sectionScore.score)}`}>
                          {sectionScore.score}
                        </div>
                        <p className="text-xs text-muted-foreground">200-800</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Progress value={percentage} className="h-2" />
                      <p className="text-sm text-muted-foreground text-right">
                        {percentage.toFixed(1)}% accuracy
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Difficulty analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Difficulty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(result.byDifficulty).map(([level, stats]) => {
                const percentage = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;

                return (
                  <div key={level} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            level === 'easy'
                              ? 'secondary'
                              : level === 'medium'
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {stats.correct} / {stats.total}
                        </span>
                      </div>
                      <span className="text-sm font-medium">{percentage.toFixed(0)}%</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader>
              <CardTitle>Test Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Total Questions</span>
                <span className="font-medium">{result.score.total}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Correct Answers</span>
                <span className="font-medium text-green-600">{result.score.correct}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Incorrect Answers</span>
                <span className="font-medium text-red-600">
                  {result.score.total - result.score.correct}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-muted-foreground">Time Spent</span>
                <span className="font-medium">{formatTime(result.totalTimeSpent)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-muted-foreground">Avg. Time per Question</span>
                <span className="font-medium">
                  {result.score.total > 0
                    ? `${Math.round(result.totalTimeSpent / result.score.total)}s`
                    : 'N/A'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => router.push('/tests')}>
            <BookOpen className="h-4 w-4 mr-2" />
            Take Another Test
          </Button>
          <Button onClick={() => router.push('/progress')}>
            <TrendingUp className="h-4 w-4 mr-2" />
            View Progress
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}

export default function TestResultsPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <TestResultsContent />
      </Suspense>
    </ProtectedRoute>
  );
}
