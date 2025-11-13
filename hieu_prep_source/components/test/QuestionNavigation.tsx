'use client';

import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { UserAnswer } from '@/types/test';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: UserAnswer[];
  questionIds: string[];
  onQuestionSelect: (index: number) => void;
}

export default function QuestionNavigation({
  totalQuestions,
  currentQuestionIndex,
  answers,
  questionIds,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const getQuestionStatus = (index: number): 'current' | 'answered' | 'marked' | 'unanswered' => {
    if (index === currentQuestionIndex) return 'current';

    const questionId = questionIds[index];
    const answer = answers.find((a) => a.questionId === questionId);

    if (!answer) return 'unanswered';
    if (answer.isMarkedForReview) return 'marked';
    if (answer.answer !== null) return 'answered';

    return 'unanswered';
  };

  const getStatusStyles = (status: string): string => {
    switch (status) {
      case 'current':
        return 'bg-primary text-primary-foreground border-primary';
      case 'answered':
        return 'bg-green-100 text-green-900 border-green-300 dark:bg-green-900 dark:text-green-100';
      case 'marked':
        return 'bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-100';
      case 'unanswered':
      default:
        return 'bg-background text-muted-foreground border-border hover:bg-accent';
    }
  };

  const answeredCount = answers.filter((a) => a.answer !== null).length;
  const markedCount = answers.filter((a) => a.isMarkedForReview).length;
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold mb-2">Question Navigator</h3>
        <div className="grid grid-cols-6 gap-2">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = getQuestionStatus(index);
            const questionId = questionIds[index];
            const answer = answers.find((a) => a.questionId === questionId);

            return (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className={`relative h-10 ${getStatusStyles(status)}`}
                onClick={() => onQuestionSelect(index)}
              >
                <span className="text-sm font-medium">{index + 1}</span>
                {answer?.isMarkedForReview && (
                  <Flag className="absolute top-1 right-1 h-3 w-3" />
                )}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Answered</span>
          </div>
          <span className="font-medium">{answeredCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded" />
            <span>Marked for Review</span>
          </div>
          <span className="font-medium">{markedCount}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded" />
            <span>Unanswered</span>
          </div>
          <span className="font-medium">{unansweredCount}</span>
        </div>
      </div>
    </div>
  );
}
