"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import { authService } from "@/app/services/auth.service";
import GitHubLoginButton from "@/app/components/ui/LoginButton";
import Skeleton from "@/app/components/ui/Skeleton";

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Skeleton className="h-12 w-48" />
      </div>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center animate-fade-in">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/20 text-accent">
          <Sparkles className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Nascent</h1>
        <p className="mt-3 text-muted text-sm leading-relaxed">
          AI-powered engineering workspace. Connect your GitHub account to analyze repositories,
          generate plans, and create pull requests.
        </p>
        <div className="mt-8">
          <GitHubLoginButton onClick={() => authService.login()} className="w-full sm:w-auto" />
        </div>
        <p className="mt-6 text-xs text-muted">
          Secure OAuth authentication via GitHub
        </p>
      </div>
    </main>
  );
}
