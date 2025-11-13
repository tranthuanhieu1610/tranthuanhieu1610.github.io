import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function TestsPage() {
  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-4">Practice Tests</h1>
          <p className="text-muted-foreground">
            Full-length SAT practice tests coming soon...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
