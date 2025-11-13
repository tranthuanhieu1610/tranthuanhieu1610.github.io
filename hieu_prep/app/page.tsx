import Link from 'next/link';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { BookOpen, Target, TrendingUp, Zap, CheckCircle, Timer } from 'lucide-react';

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
        <div className="container px-4 py-24 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Beta Version - Free Forever
            </div>
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Your Ultimate{' '}
              <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                FREE
              </span>
              <br />
              Digital SAT Question Bank
            </h1>
            <p className="mb-8 text-lg text-muted-foreground md:text-xl">
              Practice with thousands of SAT questions, track your progress, and ace the exam.
              Built by students, for students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/hieu_prep/practice">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8">
                  Start Practicing
                  <Zap className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/hieu_prep/tests">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                  Take a Practice Test
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Everything You Need to Succeed</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Comprehensive tools and features designed to help you achieve your target SAT score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">13,000+ Questions</h3>
              <p className="text-muted-foreground">
                Access thousands of official and high-quality SAT practice questions covering all sections.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Adaptive Practice</h3>
              <p className="text-muted-foreground">
                Smart filtering system to focus on specific topics, difficulty levels, and question types.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Detailed analytics and insights to monitor your improvement and identify weak areas.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Timer className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Full-Length Tests</h3>
              <p className="text-muted-foreground">
                Simulate real SAT testing conditions with timed practice tests and instant scoring.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Instant Feedback</h3>
              <p className="text-muted-foreground">
                Get immediate explanations for every question to learn from your mistakes.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Built-in Desmos</h3>
              <p className="text-muted-foreground">
                Integrated Desmos calculator and annotation tools just like the real Digital SAT.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-blue-500/10">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Your SAT Journey?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of students using HieuPrep to achieve their dream SAT scores.
            </p>
            <Link href="/hieu_prep/register">
              <Button size="lg" className="text-lg px-8">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
