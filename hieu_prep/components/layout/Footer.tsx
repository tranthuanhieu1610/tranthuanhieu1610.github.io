import Link from 'next/link';
import { Github, Mail, Heart } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">HieuPrep</h3>
            <p className="text-sm text-muted-foreground">
              Your ultimate FREE Digital SAT Question Bank and practice platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hieu_prep/practice" className="text-muted-foreground hover:text-foreground">
                  Practice Questions
                </Link>
              </li>
              <li>
                <Link href="/hieu_prep/tests" className="text-muted-foreground hover:text-foreground">
                  Practice Tests
                </Link>
              </li>
              <li>
                <Link href="/hieu_prep/progress" className="text-muted-foreground hover:text-foreground">
                  Track Progress
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hieu_prep/about" className="text-muted-foreground hover:text-foreground">
                  About SAT
                </Link>
              </li>
              <li>
                <Link href="/hieu_prep/guide" className="text-muted-foreground hover:text-foreground">
                  Study Guide
                </Link>
              </li>
              <li>
                <Link href="/hieu_prep/faq" className="text-muted-foreground hover:text-foreground">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Connect</h4>
            <div className="flex space-x-4">
              <a
                href="https://github.com/tranthuanhieu1610"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@hieuprep.com"
                className="text-muted-foreground hover:text-foreground"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            Made with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> by Tran Thuan Hieu
          </p>
          <p className="mt-2">© {currentYear} HieuPrep. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
