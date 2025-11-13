'use client';

import { useState } from 'react';
import { Highlighter, X as XIcon, StickyNote } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TestAnnotation } from '@/types/test';

interface AnnotationToolsProps {
  annotations: TestAnnotation;
  onAnnotationsChange: (annotations: TestAnnotation) => void;
}

export default function AnnotationTools({
  annotations,
  onAnnotationsChange,
}: AnnotationToolsProps) {
  const [notes, setNotes] = useState(annotations.notes || '');
  const [isNotesOpen, setIsNotesOpen] = useState(false);

  const handleNotesChange = (value: string) => {
    setNotes(value);
    onAnnotationsChange({
      ...annotations,
      notes: value,
    });
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={isNotesOpen} onOpenChange={setIsNotesOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={notes ? 'bg-yellow-50 dark:bg-yellow-900/20' : ''}
          >
            <StickyNote className="h-4 w-4 mr-2" />
            Notes
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Question Notes</h4>
            <Textarea
              placeholder="Add your notes here..."
              value={notes}
              onChange={(e) => handleNotesChange(e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-muted-foreground">
              Notes are private and will help you review later.
            </p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

interface AnswerOptionWithStrikethroughProps {
  optionId: string;
  children: React.ReactNode;
  isStrikethrough: boolean;
  onToggleStrikethrough: (optionId: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export function AnswerOptionWithStrikethrough({
  optionId,
  children,
  isStrikethrough,
  onToggleStrikethrough,
  isSelected,
  onSelect,
}: AnswerOptionWithStrikethroughProps) {
  return (
    <div className="group relative">
      <button
        onClick={onSelect}
        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
          isSelected
            ? 'border-primary bg-primary/5'
            : 'border-border hover:border-primary/50'
        } ${isStrikethrough ? 'opacity-50' : ''}`}
      >
        <div className={`flex items-start gap-3 ${isStrikethrough ? 'line-through' : ''}`}>
          <div
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-muted-foreground'
            }`}
          >
            {isSelected && <div className="w-3 h-3 rounded-full bg-primary-foreground" />}
          </div>
          <div className="flex-1">{children}</div>
        </div>
      </button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onToggleStrikethrough(optionId)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        title={isStrikethrough ? 'Remove strikethrough' : 'Strikethrough this option'}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
