import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ToastProvider } from "@/app/contexts/ToastContext";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "NascentAI",
  description: "AI-powered code generation and pull request workflow",
  metadataBase: new URL("https://nascentai.vercel.app/"),
  openGraph:{
    title: "NascentAI",
    description: "Autonomous AI coding agent.",
    url: "https://nascentai.vercel.app/",
    siteName: "NascentAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nascent",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter:{
    card: "summary_large_image",
    title: "NascentAI",
    description: "Autonomous AI coding agent.",
    images: ["/og-image.png"],
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
