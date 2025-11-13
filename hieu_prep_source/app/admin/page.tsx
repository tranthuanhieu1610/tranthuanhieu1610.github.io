import MainLayout from '@/components/layout/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <MainLayout>
        <div className="container py-12">
          <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Admin features coming soon: Upload questions, manage tests, view analytics...
          </p>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
