'use client';

import { useEffect, useRef, useState } from 'react';
import { Calculator, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

declare global {
  interface Window {
    Desmos?: any;
  }
}

interface DesmosCalculatorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DesmosCalculator({ isOpen, onOpenChange }: DesmosCalculatorProps) {
  const calculatorRef = useRef<HTMLDivElement>(null);
  const calculatorInstance = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Desmos API script
    if (!window.Desmos) {
      const script = document.createElement('script');
      script.src = 'https://www.desmos.com/api/v1.9/calculator.js?apiKey=dcb31709b452b1cf9dc26972add0fda6';
      script.async = true;
      script.onload = () => {
        setIsLoaded(true);
      };
      document.body.appendChild(script);

      return () => {
        document.body.removeChild(script);
      };
    } else {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isOpen && isLoaded && calculatorRef.current && !calculatorInstance.current) {
      calculatorInstance.current = window.Desmos.GraphingCalculator(calculatorRef.current, {
        keypad: true,
        expressions: true,
        settingsMenu: true,
        zoomButtons: true,
        expressionsTopbar: true,
        pointsOfInterest: true,
        trace: true,
        border: false,
        lockViewport: false,
      });
    }

    return () => {
      if (calculatorInstance.current && !isOpen) {
        // Don't destroy instance, just hide it to maintain state
      }
    };
  }, [isOpen, isLoaded]);

  const resetCalculator = () => {
    if (calculatorInstance.current) {
      calculatorInstance.current.setBlank();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Desmos Graphing Calculator
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={resetCalculator}
            >
              Reset
            </Button>
          </DialogTitle>
        </DialogHeader>
        <div
          ref={calculatorRef}
          className="w-full h-full border rounded-lg"
          style={{ minHeight: '500px' }}
        />
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-background">
            <p className="text-muted-foreground">Loading calculator...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function DesmosButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="gap-2"
    >
      <Calculator className="h-4 w-4" />
      Calculator
    </Button>
  );
}
