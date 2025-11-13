import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-4">Practice Questions</h1>
          <p className="text-muted-foreground">
            Question bank and practice mode coming soon...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
