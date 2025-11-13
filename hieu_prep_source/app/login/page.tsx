import MainLayout from '@/components/layout/MainLayout';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className="container max-w-md py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to continue your SAT preparation
          </p>
        </div>

        <div className="p-8 rounded-lg border bg-card">
          <p className="text-center text-muted-foreground">
            Login form coming in Phase 2...
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
