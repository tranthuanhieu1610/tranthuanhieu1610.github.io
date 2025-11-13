'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Calculator,
} from 'lucide-react';
import { getQuestionById, getAllQuestions } from '@/lib/questions';
import { recordAttempt, getLastAttempt } from '@/lib/progress';
import { Question } from '@/types/question';
import { UserAttempt } from '@/types/progress';
import DesmosCalculator, { DesmosButton } from '@/components/test/DesmosCalculator';

function QuestionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const questionId = searchParams.get('id');

  const [question, setQuestion] = useState<Question | null>(null);
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [lastAttempt, setLastAttempt] = useState<UserAttempt | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [startTime] = useState(Date.now());
  const [showCalculator, setShowCalculator] = useState(false);

  useEffect(() => {
    loadQuestion();
  }, [questionId, user]);

  const loadQuestion = async () => {
    if (!questionId || !user) return;

    try {
      setLoading(true);
      const [questionData, lastAttemptData, allQuestionsData] = await Promise.all([
        getQuestionById(questionId),
        getLastAttempt(user.id, questionId),
        getAllQuestions(),
      ]);

      if (!questionData) {
        router.push('/practice');
        return;
      }

      setQuestion(questionData);
      setAllQuestions(allQuestionsData);
      setLastAttempt(lastAttemptData);

      // If there was a previous attempt, show it
      if (lastAttemptData) {
        setSelectedAnswer(lastAttemptData.selectedAnswer);
        setSubmitted(true);
        setShowExplanation(true);
      }
    } catch (error) {
      console.error('Error loading question:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedAnswer || !question || !user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const isCorrect = selectedAnswer === question.content.correctAnswer;

    try {
      await recordAttempt(
        user.id,
        question.id,
        selectedAnswer,
        isCorrect,
        timeSpent,
        question.type,
        question.difficulty
      );

      setSubmitted(true);
      setShowExplanation(true);

      // Reload attempt to get updated data
      const updatedAttempt = await getLastAttempt(user.id, question.id);
      setLastAttempt(updatedAttempt);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const handleNextQuestion = () => {
    if (!question || allQuestions.length === 0) return;

    const currentIndex = allQuestions.findIndex((q) => q.id === question.id);
    if (currentIndex < allQuestions.length - 1) {
      const nextQuestion = allQuestions[currentIndex + 1];
      router.push(`/practice/question?id=${nextQuestion.id}`);
      // Reset state
      setSelectedAnswer(null);
      setSubmitted(false);
      setShowExplanation(false);
    } else {
      router.push('/practice');
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setShowExplanation(false);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Loading question...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!question) {
    return (
      <MainLayout>
        <div className="container py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Question not found</h2>
            <Button onClick={() => router.push('/practice')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Practice
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const isCorrect = submitted && selectedAnswer === question.content.correctAnswer;
  const isIncorrect = submitted && selectedAnswer !== question.content.correctAnswer;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      reading: 'Reading',
      writing: 'Writing & Language',
      math_no_calc: 'Math (No Calculator)',
      math_calc: 'Math (Calculator)',
    };
    return labels[type] || type;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      easy: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      hard: 'bg-red-100 text-red-800 border-red-200',
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  return (
    <MainLayout>
      <div className="container py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push('/practice')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Practice
          </Button>
          {question.desmosRequired && (
            <DesmosButton onClick={() => setShowCalculator(true)} />
          )}
        </div>

        {/* Question Info */}
        <div className="mb-6 flex flex-wrap gap-2 items-center">
          <Badge variant="outline">{getTypeLabel(question.type)}</Badge>
          <Badge className={getDifficultyColor(question.difficulty)}>
            {question.difficulty}
          </Badge>
          {question.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* Result Banner */}
        {submitted && (
          <Card className={`mb-6 p-4 ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-center gap-3">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <div>
                    <h3 className="font-semibold text-green-900">Correct!</h3>
                    <p className="text-sm text-green-700">Great job! You got the right answer.</p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-6 w-6 text-red-600" />
                  <div>
                    <h3 className="font-semibold text-red-900">Incorrect</h3>
                    <p className="text-sm text-red-700">
                      The correct answer is {question.content.correctAnswer}.
                    </p>
                  </div>
                </>
              )}
            </div>
          </Card>
        )}

        {/* Question Content */}
        <Card className="mb-6">
          <div className="p-6">
            {question.content.passage && (
              <div className="mb-6 pb-6 border-b">
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: question.content.passage }}
                />
              </div>
            )}

            <div className="mb-6">
              <div
                className="prose prose-sm max-w-none font-medium"
                dangerouslySetInnerHTML={{ __html: question.content.question }}
              />
            </div>

            {/* Answer Options */}
            <div className="space-y-3">
              {question.content.options.map((option) => {
                const isSelected = selectedAnswer === option.id;
                const isCorrectAnswer = option.id === question.content.correctAnswer;
                const showCorrect = submitted && isCorrectAnswer;
                const showIncorrect = submitted && isSelected && !isCorrectAnswer;

                return (
                  <button
                    key={option.id}
                    onClick={() => !submitted && setSelectedAnswer(option.id)}
                    disabled={submitted}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      submitted
                        ? showCorrect
                          ? 'border-green-500 bg-green-50'
                          : showIncorrect
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 bg-gray-50'
                        : isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                    } ${submitted ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold ${
                          submitted
                            ? showCorrect
                              ? 'border-green-500 bg-green-500 text-white'
                              : showIncorrect
                              ? 'border-red-500 bg-red-500 text-white'
                              : 'border-gray-300 text-gray-600'
                            : isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-gray-300 text-gray-600'
                        }`}
                      >
                        {option.id}
                      </div>
                      <div
                        className="flex-1 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: option.text }}
                      />
                      {submitted && showCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                      )}
                      {submitted && showIncorrect && (
                        <XCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Explanation */}
        {showExplanation && question.content.explanation && (
          <Card className="mb-6 bg-blue-50 border-blue-200">
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">Explanation</h3>
              </div>
              <div
                className="prose prose-sm max-w-none text-blue-900"
                dangerouslySetInnerHTML={{ __html: question.content.explanation }}
              />
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          {!submitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="flex-1"
              size="lg"
            >
              Submit Answer
            </Button>
          ) : (
            <>
              <Button onClick={handleTryAgain} variant="outline" size="lg">
                Try Again
              </Button>
              <Button onClick={handleNextQuestion} className="flex-1" size="lg">
                Next Question
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </>
          )}
        </div>

        {/* Statistics */}
        {lastAttempt && (
          <Card className="mt-6">
            <div className="p-4">
              <h4 className="text-sm font-medium mb-2">Your Statistics</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Last Attempt</p>
                  <p className="font-medium">
                    {lastAttempt.isCorrect ? (
                      <span className="text-green-600">Correct</span>
                    ) : (
                      <span className="text-red-600">Incorrect</span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Time Spent</p>
                  <p className="font-medium">{lastAttempt.timeSpent}s</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Desmos Calculator */}
      <DesmosCalculator isOpen={showCalculator} onOpenChange={setShowCalculator} />
    </MainLayout>
  );
}

export default function QuestionPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <QuestionContent />
      </Suspense>
    </ProtectedRoute>
  );
}
