'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Play, History } from 'lucide-react';
import { getAllTests, getUserTestSessions } from '@/lib/tests';
import { Test, UserTestSession } from '@/types/test';
import { useAuth } from '@/contexts/AuthContext';

export default function TestsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tests, setTests] = useState<Test[]>([]);
  const [sessions, setSessions] = useState<UserTestSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const [testsData, sessionsData] = await Promise.all([
        getAllTests(),
        getUserTestSessions(user.id),
      ]);
      setTests(testsData);
      setSessions(sessionsData);
    } catch (error) {
      console.error('Error loading tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTestSession = (testId: string): UserTestSession | undefined => {
    return sessions.find((s) => s.testId === testId && s.status === 'in_progress');
  };

  const getCompletedSessions = (testId: string): number => {
    return sessions.filter((s) => s.testId === testId && s.status === 'completed').length;
  };

  const startTest = (testId: string) => {
    router.push(`/tests/take?testId=${testId}`);
  };

  const resumeTest = (sessionId: string) => {
    router.push(`/tests/take?sessionId=${sessionId}`);
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <MainLayout>
          <div className="container py-12">
            <div className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">Loading tests...</p>
            </div>
          </div>
        </MainLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container py-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Practice Tests</h1>
            <p className="text-muted-foreground">
              Take full-length SAT practice tests with real timing and scoring
            </p>
          </div>

          {tests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground text-center">
                  No tests available yet. Check back soon!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tests.map((test) => {
                const inProgressSession = getTestSession(test.id);
                const completedCount = getCompletedSessions(test.id);

                return (
                  <Card key={test.id} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={test.type === 'full_test' ? 'default' : 'secondary'}>
                          {test.type === 'full_test' ? 'Full Test' : 'Module'}
                        </Badge>
                        {completedCount > 0 && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <History className="h-4 w-4" />
                            <span>{completedCount}x</span>
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-xl">{test.name}</CardTitle>
                      <CardDescription>{test.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <BookOpen className="h-4 w-4" />
                          <span>{test.totalQuestions} questions</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{test.totalDuration} minutes</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm font-medium">Sections:</p>
                        <div className="space-y-1">
                          {test.sections.map((section, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-muted-foreground flex items-center justify-between"
                            >
                              <span>{section.name}</span>
                              <span className="text-xs">
                                {section.questionIds.length} Q • {section.timeLimit} min
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {inProgressSession ? (
                        <Button
                          onClick={() => resumeTest(inProgressSession.id)}
                          className="w-full gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Resume Test
                        </Button>
                      ) : (
                        <Button onClick={() => startTest(test.id)} className="w-full gap-2">
                          <Play className="h-4 w-4" />
                          Start Test
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
