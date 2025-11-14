import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RateMyAms - Rate Hanoi Amsterdam Teachers",
  description: "Rate and review teachers at Hanoi-Amsterdam High School for the Gifted",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="bg-white border-b shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <a href="/rate-ams-teacher" className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-primary">
                    <span className="text-[#4CAF50]">Rate</span>MyAms
                  </h1>
                </a>
                <nav className="flex items-center space-x-6">
                  <a
                    href="/rate-ams-teacher"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Home
                  </a>
                  <a
                    href="/rate-ams-teacher/submit-review"
                    className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#45a049] transition-colors"
                  >
                    Rate a Teacher
                  </a>
                </nav>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-gray-50 border-t mt-12">
            <div className="container mx-auto px-4 py-8">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">
                  <strong>RateMyAms</strong> - For Hanoi-Amsterdam High School for the Gifted students
                </p>
                <p className="text-xs">
                  Disclaimer: All reviews are anonymous and reflect individual student opinions.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
