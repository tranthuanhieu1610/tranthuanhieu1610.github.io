'use client';

import { useState, useEffect } from 'react';
import { Clock, Pause, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TestTimerProps {
  initialTimeRemaining: number; // in seconds
  isPaused: boolean;
  onTimeUpdate: (timeRemaining: number) => void;
  onTimeExpired: () => void;
  onPauseToggle: () => void;
}

export default function TestTimer({
  initialTimeRemaining,
  isPaused,
  onTimeUpdate,
  onTimeExpired,
  onPauseToggle,
}: TestTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining);

  useEffect(() => {
    setTimeRemaining(initialTimeRemaining);
  }, [initialTimeRemaining]);

  useEffect(() => {
    if (isPaused || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTime = prev - 1;
        onTimeUpdate(newTime);

        if (newTime <= 0) {
          onTimeExpired();
          return 0;
        }

        return newTime;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining, onTimeUpdate, onTimeExpired]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = (): string => {
    if (timeRemaining <= 60) return 'text-red-600'; // Last minute - red
    if (timeRemaining <= 300) return 'text-orange-600'; // Last 5 minutes - orange
    return 'text-foreground';
  };

  const isLowTime = timeRemaining <= 300; // Last 5 minutes

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-background border rounded-lg">
      <Clock
        className={`h-5 w-5 ${getTimerColor()} ${isLowTime ? 'animate-pulse' : ''}`}
      />
      <span className={`text-lg font-mono font-bold ${getTimerColor()}`}>
        {formatTime(timeRemaining)}
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onPauseToggle}
        className="ml-2"
        title={isPaused ? 'Resume' : 'Pause'}
      >
        {isPaused ? (
          <Play className="h-4 w-4" />
        ) : (
          <Pause className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
