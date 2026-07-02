"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-neutral-850">
      {/* Hero */}
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-24 text-center">
        {/* Lotus Logo */}
        <div className="mb-6 flex items-center justify-center">
          <img
            src="/lotus.svg"
            alt="Nascent"
            className="h-20 w-20 text-white"
          />
        </div>

        {/* Branding */}
        <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-7xl">
          Nascent
        </h1>

        <p className="mt-3 text-sm font-semibold tracking-wider text-neutral-400 uppercase">
          AI Software Engineer for GitHub
        </p>

        {/* Subtitle & Description */}
        <div className="max-w-2xl mx-auto mt-12 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-snug">
            Repository-aware AI that plans before it writes code.
          </h2>
          <p className="mt-4 text-base md:text-lg text-neutral-400 leading-relaxed font-normal">
            Analyze an existing repository, generate an engineering implementation plan, review every change, generate production-ready code, and automatically open a Pull Request.
          </p>
          <p className="mt-4 text-sm text-neutral-500 leading-relaxed font-medium italic">
            Still in development phase.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex flex-col items-center gap-4">
          <GitHubLoginButton
            onClick={() => authService.login()}
            className="min-w-[260px] shadow-lg"
          />
          <p className="text-xs text-neutral-500 font-medium">
            GitHub OAuth App • No credit card required
          </p>
        </div>
      </section>

      {/* How Nascent Works */}
      <section className="border-t border-border bg-surface py-32">
        <div className="mx-auto max-w-4xl px-6">
          <div className="mb-20 text-center">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3">Process</h2>
            <h3 className="text-3xl font-bold tracking-tight text-white">How Nascent works</h3>
          </div>

          <div className="flex flex-col items-center">
            {[
              {
                title: "Analyze Repository",
                desc: "Scan repository codebase structure, directories, files, and dependencies."
              },
              {
                title: "Engineering Plan",
                desc: "Formulate a step-by-step engineering plan outlining exactly what will be modified."
              },
              {
                title: "Human Approval",
                desc: "Review and approve the plan, keeping you in control before execution begins."
              },
              {
                title: "Generate Code",
                desc: "Write production-grade code that aligns with the codebase's existing patterns."
              },
              {
                title: "Open Pull Request",
                desc: "Automatically push the branch to GitHub and create an open Pull Request."
              }
            ].map((step, index, arr) => (
              <div key={step.title} className="w-full max-w-lg flex flex-col items-center">
                <div className="w-full rounded-lg border border-border bg-black p-6 hover:border-neutral-500 transition-colors duration-200">
                  <div className="flex items-center gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-sm font-semibold text-neutral-400">
                      {index + 1}
                    </span>
                    <div className="text-left">
                      <h4 className="font-semibold text-white text-base leading-snug">{step.title}</h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </div>
                {index < arr.length - 1 && (
                  <div className="my-5 text-neutral-500 text-xl font-bold select-none">↓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-32 max-w-5xl mx-auto px-6 border-t border-border bg-black">
        <div className="mb-20 text-center">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-3 font-medium">Architecture</h2>
          <h3 className="text-3xl font-bold tracking-tight text-white">Features Built for Teams</h3>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {[
            {
              title: "Repository-aware",
              desc: "Reads and processes your entire repository context to align with design patterns."
            },
            {
              title: "Human-in-the-loop",
              desc: "Gives engineers full control over which planning steps are approved or rejected."
            },
            {
              title: "GitHub Native",
              desc: "Integrates directly with branches, code commits, and standard review flows."
            },
            {
              title: "Production Ready",
              desc: "Outputs clean, tested, and linted code adhering to your code standards."
            }
          ].map((feat) => (
            <div
              key={feat.title}
              className="rounded-lg border border-border bg-surface p-8 transition duration-200 hover:border-neutral-500"
            >
              <h4 className="text-lg font-bold text-white mb-2">{feat.title}</h4>
              <p className="text-sm text-neutral-400 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-black py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 text-xs text-neutral-500 md:flex-row">
          <div className="flex items-center gap-2.5">
            <img src="/lotus.svg" alt="Lotus" className="h-5 w-5 opacity-60" />
            <span>© {new Date().getFullYear()} Nascent. Still in development phase.</span>
          </div>

          <div className="flex gap-8">
            <span className="hover:text-white cursor-pointer transition-colors">GitHub</span>
            <span className="hover:text-white cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
          </div>
        </div>
      </footer>
    </main>
  );
}