import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ToastProvider } from "@/app/contexts/ToastContext";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "NascentAI",
  description: "AI-powered code generation and pull request workflow",
  metadataBase: new URL("https://nascentai.vercel.app/"),
  openGraph: {
    title: "NascentAI",
    description: "Repository-aware AI software engineer for GitHub.",
    url: "https://nascentai.vercel.app",
    siteName: "NascentAI",
    images: [
      {
        url: "/og-image",
        width: 1200,
        height: 630,
        alt: "NascentAI",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "NascentAI",
    description: "Repository-aware AI software engineer for GitHub.",
    images: ["/og-image"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
