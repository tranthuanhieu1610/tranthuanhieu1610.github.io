'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your admin preferences and application settings
          </p>
        </div>

        {/* Settings Placeholder */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Settings className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">Settings Coming Soon</h3>
            <p className="text-muted-foreground text-center max-w-md">
              Admin settings and preferences will be available here in the next update.
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
