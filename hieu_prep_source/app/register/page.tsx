import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className="container max-w-md py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">
            Sign up to start practicing for the SAT
          </p>
        </div>

        <div className="p-8 rounded-lg border bg-card">
          <p className="text-center text-muted-foreground">
            Registration form coming in Phase 2...
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
