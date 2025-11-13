import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function ProgressPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-4">Your Progress</h1>
          <p className="text-muted-foreground">
            Progress tracking and analytics coming soon...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
