import * as React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solinth Suite - All-in-One Business Management",
  description:
    "Professional business management platform with 8 integrated suites. Track every metric, discover correlations, and make data-driven decisions.",
  keywords: [
    "business management",
    "analytics",
    "dashboard",
    "metrics",
    "AI assistant",
  ],
  authors: [{ name: "Solinth" }],
  creator: "Solinth",
  publisher: "Solinth",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
