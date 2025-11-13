'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Menu,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import TestTimer from '@/components/test/TestTimer';
import QuestionNavigation from '@/components/test/QuestionNavigation';
import DesmosCalculator, { DesmosButton } from '@/components/test/DesmosCalculator';
import AnnotationTools, { AnswerOptionWithStrikethrough } from '@/components/test/AnnotationTools';
import {
  getTestById,
  getTestSession,
  createTestSession,
  updateTestSession,
  saveAnswer,
  completeTest,
} from '@/lib/tests';
import { getQuestionById } from '@/lib/questions';
import { Test, UserTestSession, UserAnswer, TestAnnotation } from '@/types/test';
import { Question } from '@/types/question';

function TestTakingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const [test, setTest] = useState<Test | null>(null);
  const [session, setSession] = useState<UserTestSession | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);

  // UI states
  const [showNav, setShowNav] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isMarkedForReview, setIsMarkedForReview] = useState(false);
  const [annotations, setAnnotations] = useState<TestAnnotation>({
    highlights: [],
    strikethroughs: [],
    notes: '',
  });

  useEffect(() => {
    initializeTest();
  }, [searchParams, user]);

  const initializeTest = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const testId = searchParams.get('testId');
      const sessionId = searchParams.get('sessionId');

      let currentSession: UserTestSession | null = null;
      let currentTest: Test | null = null;

      if (sessionId) {
        // Resume existing session
        currentSession = await getTestSession(sessionId);
        if (!currentSession) {
          throw new Error('Session not found');
        }
        currentTest = await getTestById(currentSession.testId);
      } else if (testId) {
        // Start new session
        const newSessionId = await createTestSession(user.id, testId);
        currentSession = await getTestSession(newSessionId);
        currentTest = await getTestById(testId);
      } else {
        throw new Error('No test or session specified');
      }

      if (!currentTest || !currentSession) {
        throw new Error('Failed to load test');
      }

      // Load all questions
      const allQuestions: Question[] = [];
      for (const section of currentTest.sections) {
        for (const qId of section.questionIds) {
          const q = await getQuestionById(qId);
          if (q) allQuestions.push(q);
        }
      }

      setTest(currentTest);
      setSession(currentSession);
      setQuestions(allQuestions);

      // Load current question
      const currentIdx = currentSession.currentQuestionIndex;
      if (allQuestions[currentIdx]) {
        loadQuestion(allQuestions[currentIdx].id, currentSession);
      }
    } catch (error) {
      console.error('Error initializing test:', error);
      router.push('/tests');
    } finally {
      setLoading(false);
    }
  };

  const loadQuestion = (questionId: string, sess: UserTestSession) => {
    const question = questions.find((q) => q.id === questionId);
    if (!question) return;

    setCurrentQuestion(question);

    // Load saved answer if exists
    const savedAnswer = sess.answers.find((a) => a.questionId === questionId);
    if (savedAnswer) {
      setSelectedAnswer(savedAnswer.answer);
      setIsMarkedForReview(savedAnswer.isMarkedForReview);
      setAnnotations(savedAnswer.annotations || { highlights: [], strikethroughs: [], notes: '' });
    } else {
      setSelectedAnswer(null);
      setIsMarkedForReview(false);
      setAnnotations({ highlights: [], strikethroughs: [], notes: '' });
    }
  };

  const saveCurrentAnswer = useCallback(async () => {
    if (!session || !currentQuestion) return;

    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      answer: selectedAnswer,
      timeSpent: 0, // TODO: Track time per question
      isMarkedForReview,
      annotations,
    };

    await saveAnswer(session.id, answer);

    // Update local session state
    const updatedAnswers = [...session.answers];
    const existingIdx = updatedAnswers.findIndex((a) => a.questionId === currentQuestion.id);
    if (existingIdx >= 0) {
      updatedAnswers[existingIdx] = answer;
    } else {
      updatedAnswers.push(answer);
    }
    setSession({ ...session, answers: updatedAnswers });
  }, [session, currentQuestion, selectedAnswer, isMarkedForReview, annotations]);

  const navigateToQuestion = async (index: number) => {
    if (!session || !test || index < 0 || index >= questions.length) return;

    // Save current answer
    await saveCurrentAnswer();

    // Update session
    await updateTestSession(session.id, { currentQuestionIndex: index });

    // Load new question
    const newQuestion = questions[index];
    if (newQuestion) {
      loadQuestion(newQuestion.id, { ...session, currentQuestionIndex: index });
      setSession({ ...session, currentQuestionIndex: index });
    }
  };

  const handlePrevious = () => {
    if (!session) return;
    navigateToQuestion(session.currentQuestionIndex - 1);
  };

  const handleNext = () => {
    if (!session) return;
    navigateToQuestion(session.currentQuestionIndex + 1);
  };

  const handleSubmitTest = async () => {
    if (!session) return;

    try {
      // Save final answer
      await saveCurrentAnswer();

      // Complete test
      const result = await completeTest(session.id);

      // Navigate to results
      router.push(`/tests/results?resultId=${result.id}`);
    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const handleTimeUpdate = async (timeRemaining: number) => {
    if (!session || !test) return;

    const sectionIndex = session.currentSectionIndex;
    const newSectionTimes = [...session.sectionTimeRemaining];
    newSectionTimes[sectionIndex] = timeRemaining;

    await updateTestSession(session.id, {
      sectionTimeRemaining: newSectionTimes,
    });
  };

  const handleTimeExpired = () => {
    setShowSubmitDialog(true);
  };

  const toggleMarkForReview = async () => {
    setIsMarkedForReview(!isMarkedForReview);
  };

  const toggleStrikethrough = (optionId: string) => {
    setAnnotations((prev) => {
      const strikethroughs = prev.strikethroughs.includes(optionId)
        ? prev.strikethroughs.filter((id) => id !== optionId)
        : [...prev.strikethroughs, optionId];
      return { ...prev, strikethroughs };
    });
  };

  if (loading || !test || !session || !currentQuestion) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading test...</p>
      </div>
    );
  }

  const currentSection = test.sections[session.currentSectionIndex];
  const isLastQuestion = session.currentQuestionIndex === questions.length - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setShowNav(!showNav)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="font-semibold">{test.name}</h2>
              <p className="text-xs text-muted-foreground">{currentSection.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentSection.calculatorAllowed && (
              <DesmosButton onClick={() => setShowCalculator(true)} />
            )}
            <TestTimer
              initialTimeRemaining={session.sectionTimeRemaining[session.currentSectionIndex]}
              isPaused={session.status === 'paused'}
              onTimeUpdate={handleTimeUpdate}
              onTimeExpired={handleTimeExpired}
              onPauseToggle={() => {}}
            />
            <Button variant="outline" onClick={() => setShowSubmitDialog(true)}>
              Submit Test
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Question header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Question {session.currentQuestionIndex + 1} of {questions.length}
              </h3>
              <div className="flex items-center gap-2">
                <AnnotationTools
                  annotations={annotations}
                  onAnnotationsChange={setAnnotations}
                />
                <Button
                  variant={isMarkedForReview ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleMarkForReview}
                >
                  <Flag className="h-4 w-4 mr-2" />
                  {isMarkedForReview ? 'Marked' : 'Mark for Review'}
                </Button>
              </div>
            </div>

            {/* Question content */}
            <Card className="p-6">
              {currentQuestion.content.passage && (
                <div className="mb-6 pb-6 border-b">
                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: currentQuestion.content.passage }} />
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: currentQuestion.content.question }} />
                </div>

                <div className="space-y-3">
                  {currentQuestion.content.options.map((option) => (
                    <AnswerOptionWithStrikethrough
                      key={option.id}
                      optionId={option.id}
                      isStrikethrough={annotations.strikethroughs.includes(option.id)}
                      onToggleStrikethrough={toggleStrikethrough}
                      isSelected={selectedAnswer === option.id}
                      onSelect={() => setSelectedAnswer(option.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-semibold">{option.id}.</span>
                        <div
                          className="flex-1"
                          dangerouslySetInnerHTML={{ __html: option.text }}
                        />
                      </div>
                    </AnswerOptionWithStrikethrough>
                  ))}
                </div>
              </div>
            </Card>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={session.currentQuestionIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button onClick={() => setShowSubmitDialog(true)} className="gap-2">
                  Review and Submit
                  <CheckCircle2 className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:block ${showNav ? 'block' : 'hidden'}`}>
            <div className="sticky top-24">
              <Card className="p-4">
                <QuestionNavigation
                  totalQuestions={questions.length}
                  currentQuestionIndex={session.currentQuestionIndex}
                  answers={session.answers}
                  questionIds={questions.map((q) => q.id)}
                  onQuestionSelect={navigateToQuestion}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Desmos Calculator */}
      <DesmosCalculator isOpen={showCalculator} onOpenChange={setShowCalculator} />

      {/* Submit confirmation dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Test?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to submit your test? You have answered{' '}
              {session.answers.filter((a) => a.answer !== null).length} out of {questions.length}{' '}
              questions.
              {session.answers.filter((a) => a.isMarkedForReview).length > 0 && (
                <span className="block mt-2 text-yellow-600 dark:text-yellow-500">
                  You have {session.answers.filter((a) => a.isMarkedForReview).length} questions
                  marked for review.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Testing</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitTest}>Submit Test</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function TestTakingPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <TestTakingContent />
      </Suspense>
    </ProtectedRoute>
  );
}
