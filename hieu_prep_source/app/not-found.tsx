'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Auto-redirect old practice URLs to new format
    // Pattern: /practice/[id] -> /practice/question?id=[id]
    const practiceMatch = pathname.match(/^\/practice\/([a-zA-Z0-9]+)$/);
    if (practiceMatch) {
      const questionId = practiceMatch[1];
      // Redirect to new URL format
      router.push(`/practice/question?id=${questionId}`);
    }
  }, [pathname, router]);

  return (
    <MainLayout>
      <div className="container py-12">
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>

                <div className="space-y-2">
                  <h1 className="text-2xl font-bold">Page Not Found</h1>
                  <p className="text-muted-foreground">
                    The page you're looking for doesn't exist or has been moved.
                  </p>
                  {pathname.includes('/practice/') && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-2">
                      Redirecting to question page...
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-4 w-full">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Go Back
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={() => router.push('/')}
                  >
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Button>
                </div>

                <div className="pt-4 w-full border-t">
                  <p className="text-sm text-muted-foreground mb-3">
                    Quick links:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/practice')}
                    >
                      Practice
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/tests')}
                    >
                      Tests
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/progress')}
                    >
                      Progress
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push('/admin')}
                    >
                      Admin
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
