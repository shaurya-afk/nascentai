import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import { ToastProvider } from "@/app/contexts/ToastContext";

export const metadata: Metadata = {
  title: "NascentAI",
  description: "AI-powered code generation and pull request workflow",
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
      </body>
    </html>
  );
}
