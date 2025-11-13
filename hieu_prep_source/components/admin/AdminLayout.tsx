'use client';

import { ReactNode } from 'react';
import Header from '@/components/layout/Header';
import AdminSidebar from './AdminSidebar';
import ProtectedRoute from '@/components/auth/ProtectedRoute';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 ml-64 p-8">
            {children}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
