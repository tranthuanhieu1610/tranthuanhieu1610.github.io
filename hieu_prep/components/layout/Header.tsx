'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { BookOpen, BarChart3, User, LogOut } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'text-primary font-semibold' : 'text-muted-foreground hover:text-foreground';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/hieu_prep" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            HieuPrep
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="/hieu_prep/practice" className={isActive('/hieu_prep/practice')}>
            Practice
          </Link>
          <Link href="/hieu_prep/tests" className={isActive('/hieu_prep/tests')}>
            Tests
          </Link>
          <Link href="/hieu_prep/progress" className={isActive('/hieu_prep/progress')}>
            <BarChart3 className="inline h-4 w-4 mr-1" />
            Progress
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="outline" size="sm">
            Sign In
          </Button>
        </div>
      </div>
    </header>
  );
}
