'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, ClipboardList } from 'lucide-react';

export default function TestBuilderPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Test Builder</h1>
            <p className="text-muted-foreground mt-2">
              Create and manage practice tests from your question bank
            </p>
          </div>
          <Button size="lg">
            <Plus className="mr-2 h-4 w-4" />
            Create New Test
          </Button>
        </div>

        {/* Empty State */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ClipboardList className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Tests Created Yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first practice test by selecting questions from your question bank.
              Students will be able to take timed tests and see their scores.
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Test
            </Button>
          </CardContent>
        </Card>

        {/* Coming Soon Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Questions</CardTitle>
              <CardDescription>
                Choose questions from your bank by type, difficulty, or tags
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Set Timer</CardTitle>
              <CardDescription>
                Configure time limits for each section of the test
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Publish Test</CardTitle>
              <CardDescription>
                Make tests available for students to practice
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
