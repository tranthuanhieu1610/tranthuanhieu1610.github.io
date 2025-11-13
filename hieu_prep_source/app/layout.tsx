import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HieuPrep - Your Ultimate FREE Digital SAT Question Bank",
  description: "Practice with thousands of SAT questions. Track your progress, take full-length tests, and ace the Digital SAT exam.",
  keywords: ["SAT", "Digital SAT", "SAT Practice", "SAT Questions", "Test Prep", "College Prep"],
  authors: [{ name: "Tran Thuan Hieu" }],
  creator: "Tran Thuan Hieu",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tranthuanhieu1610.github.io/hieu_prep",
    title: "HieuPrep - FREE Digital SAT Question Bank",
    description: "Practice with thousands of SAT questions and ace the Digital SAT exam.",
    siteName: "HieuPrep",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
