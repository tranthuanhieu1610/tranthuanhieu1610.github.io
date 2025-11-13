'use client';

import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Users, ClipboardList, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  // TODO: Fetch real data from Firestore
  const stats = [
    {
      title: 'Total Questions',
      value: '0',
      description: 'SAT questions in database',
      icon: FileText,
      trend: '+0 this week',
    },
    {
      title: 'Total Users',
      value: '0',
      description: 'Registered students',
      icon: Users,
      trend: '+0 this week',
    },
    {
      title: 'Practice Tests',
      value: '0',
      description: 'Available test sets',
      icon: ClipboardList,
      trend: '+0 this week',
    },
    {
      title: 'Completion Rate',
      value: '0%',
      description: 'Average test completion',
      icon: TrendingUp,
      trend: 'All time',
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your SAT question bank and student progress
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                  <p className="text-xs text-primary mt-2">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push('/admin/upload')}
            >
              <CardHeader>
                <CardTitle className="text-lg">Upload Question</CardTitle>
                <CardDescription>
                  Add new SAT questions using markdown format
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push('/admin/tests')}
            >
              <CardHeader>
                <CardTitle className="text-lg">Create Test</CardTitle>
                <CardDescription>
                  Build a new practice test from question bank
                </CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => router.push('/admin/analytics')}
            >
              <CardHeader>
                <CardTitle className="text-lg">View Analytics</CardTitle>
                <CardDescription>
                  Check detailed statistics and user performance
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">
                No recent activity. Start by uploading your first question!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
