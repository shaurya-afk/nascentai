// page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { authService } from "@/app/services/auth.service";
import GitHubLoginButton from "@/app/components/ui/LoginButton";
import Skeleton from "@/app/components/ui/Skeleton";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

const STEPS = [
  {
    title: "Analyze the repository",
    desc: "Nascent reads your codebase — structure, dependencies, and existing conventions — before touching a single file.",
  },
  {
    title: "Draft an engineering plan",
    desc: "It writes out exactly what it intends to change and why, in plain language you can actually review.",
  },
  {
    title: "Wait for your approval",
    desc: "Nothing gets written until you approve the plan. You stay the final decision-maker, every time.",
  },
  {
    title: "Generate the code",
    desc: "Once approved, it writes production-grade code that matches the patterns already in your codebase.",
  },
  {
    title: "Open a pull request",
    desc: "The branch is pushed and a PR opens automatically, ready to drop into your team's normal review flow.",
  },
];

const FEATURES = [
  {
    label: "Repo-aware",
    desc: "Reads your entire repository context, not just the file in front of it, so changes stay consistent with the rest of your codebase.",
  },
  {
    label: "Human-in-the-loop",
    desc: "You approve or reject the plan before any code gets written. Nascent never merges on its own.",
  },
  {
    label: "GitHub native",
    desc: "Works directly with branches, commits, and pull requests — no separate dashboard to babysit.",
  },
  {
    label: "Production-ready",
    desc: "Output is linted and structured to match the conventions already in your repo, not generic boilerplate.",
  },
];

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const steps = useReveal<HTMLDivElement>();
  const features = useReveal<HTMLDivElement>();
  const [imageLoaded, setImageLoaded] = useState(false);

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
    <main className="min-h-screen overflow-x-hidden bg-black text-white selection:bg-white/20 selection:text-white">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-8"
        style={{
          animation: "fadeDown 0.6s ease-out both",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-black/10">
            <img src="/lotus.svg" alt="" className="h-8 w-8 opacity-90" />
          </div>
          <span className="font-display text-sm font-semibold tracking-tight text-white/90">
            Nascent
          </span>
        </div>
        <a
          href="https://github.com/shaurya-afk/nascent"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 text-[11px] font-medium text-white/60 ring-1 ring-white/10 transition-all hover:bg-white/10 hover:text-white/90 hover:ring-white/20"
        >
          <svg className="h-3.5 w-3.5 opacity-60 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <span className="uppercase tracking-wider">GitHub</span>
        </a>
      </header>

      {/* Hero Section */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-20">
        {/* Background ambient effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }}
          />
          
          {/* Gradient orbs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-transparent blur-3xl animate-pulse" 
              style={{ animationDuration: '8s' }}
            />
          </div>
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] opacity-10">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-transparent to-transparent blur-3xl animate-pulse" 
              style={{ animationDuration: '12s', animationDelay: '2s' }}
            />
          </div>
        </div>

        {/* Central lotus artwork */}
          {/* Full-screen lotus background */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none select-none overflow-hidden"
          >
            <img
              src="/hero-lotus.png"
              alt=""
              onLoad={() => setImageLoaded(true)}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-1000 ${
                imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
              }`}
              style={{
                filter: "brightness(0.45) saturate(0.9)",
              }}
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/45" />

            {/* Center spotlight */}
            <div
              className="absolute inset-x-0 top-0 bottom-40"
              style={{
                background:
                  "radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.75) 100%)",
              }}
            />

            {/* Top fade */}
            <div className="absolute inset-x-0 top-0 h-56 bg-gradient-to-b from-black via-black/60 to-transparent" />

            {/* Bottom fade */}
            <div
              className="absolute inset-x-0 bottom-0 h-[520px]"
              style={{
                background:
                  "linear-gradient(to top, rgb(0,0,0) 0%, rgba(0,0,0,.95) 18%, rgba(0,0,0,.75) 40%, rgba(0,0,0,.35) 70%, transparent 100%)",
              }}
            />

            {/* Left vignette */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-black to-transparent" />

            {/* Right vignette */}
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-black to-transparent" />

            {/* Soft ambient glow */}
            <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.05] blur-[180px]" />

            {/* Grid */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
                `,
                backgroundSize: "72px 72px",
              }}
            />
          </div>
        {/* Content */}
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
            style={{ animation: "fadeUp 0.7s ease-out 0.1s both" }}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/50 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-white/70" />
            </span>
            <span className="font-mono text-[11px] font-medium text-white/60 tracking-wider uppercase">
              Now in beta
            </span>
          </div>

          {/* Main heading */}
          <h1
            className="font-display mt-8 text-6xl font-bold tracking-tight text-white md:text-7xl lg:text-8xl"
            style={{ animation: "fadeUp 0.7s ease-out 0.2s both" }}
          >
            <span className="bg-gradient-to-b from-white via-white to-white/40 bg-clip-text text-transparent">
              AI that ships
            </span>
            <br />
            <span className="bg-gradient-to-b from-white/80 via-white/60 to-white/20 bg-clip-text text-transparent">
              code, not chaos
            </span>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-white/50 md:text-xl"
            style={{ animation: "fadeUp 0.7s ease-out 0.3s both" }}
          >
            Repository-aware engineering agent that plans before it codes. 
            Draft, approve, generate — all within your GitHub workflow.
          </p>

          {/* CTA */}
          <div
            className="mt-10 flex flex-col items-center gap-4"
            style={{ animation: "fadeUp 0.7s ease-out 0.4s both" }}
          >
            <GitHubLoginButton
              onClick={() => authService.login()}
              className="min-w-[280px] shadow-2xl shadow-white/5"
            />
            <p className="flex items-center gap-2 font-mono text-[11px] text-white/30 tracking-wide">
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              GitHub OAuth
              <span className="text-white/20">·</span>
              No credit card required
            </p>
          </div>

          {/* Trust indicators */}
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
            style={{ animation: "fadeUp 0.7s ease-out 0.5s both" }}
          >
            {[
              { label: "Repository-aware", icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" },
              { label: "Human-in-the-loop", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" },
              { label: "PR-native", icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2 text-white/30">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                </svg>
                <span className="text-[11px] font-medium uppercase tracking-wider">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          style={{ animation: "fadeIn 1s ease-out 1.2s both" }}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/20">
              Scroll
            </span>
            <div className="h-8 w-px bg-gradient-to-b from-white/20 to-transparent" />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-white/5 bg-black py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Process
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Plan first, code later
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/40">
              Nascent follows the same engineering discipline you'd expect from a senior developer.
            </p>
          </div>

          <div ref={steps.ref} className="grid gap-px rounded-2xl bg-white/5 p-px">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="group relative overflow-hidden rounded-2xl bg-black p-8 transition-all duration-700 hover:bg-white/[0.02] md:p-10"
                style={{
                  opacity: steps.visible ? 1 : 0,
                  transform: steps.visible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: `${i * 100}ms`,
                }}
              >
                <div className="flex items-start gap-6">
                  <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-white/5 font-mono text-sm text-white/40 ring-1 ring-white/5">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/40 md:text-base">
                      {step.desc}
                    </p>
                  </div>
                </div>
                {/* Connector line */}
                {i < STEPS.length - 1 && (
                  <div className="absolute left-[51px] top-[72px] h-8 w-px bg-white/5 md:left-[59px] md:top-[80px]" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-white/5 bg-black py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="mb-20">
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">
              Capabilities
            </p>
            <h2 className="font-display mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
              Built for production
            </h2>
            <p className="mt-4 max-w-xl text-base text-white/40">
              Every feature is designed around real engineering workflows, not demos.
            </p>
          </div>

          <div ref={features.ref} className="grid gap-4 md:grid-cols-2">
            {FEATURES.map((feat, i) => (
              <div
                key={feat.label}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-700 hover:border-white/10 hover:bg-white/[0.04] md:p-10"
                style={{
                  opacity: features.visible ? 1 : 0,
                  transform: features.visible ? "translateY(0)" : "translateY(12px)",
                  transitionDelay: `${i * 80}ms`,
                }}
              >
                <h3 className="font-display text-lg font-semibold text-white">
                  {feat.label}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-white/40 md:text-base">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-white/5 bg-black py-32 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
            Ready to ship
            <span className="bg-gradient-to-b from-white/60 to-white/20 bg-clip-text text-transparent"> smarter?</span>
          </h2>
          <p className="mt-6 text-lg text-white/40">
            Connect a repository and let Nascent show you what it can plan.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4">
            <GitHubLoginButton
              onClick={() => authService.login()}
              className="min-w-[280px] shadow-2xl shadow-white/5"
            />
            <p className="font-mono text-[11px] tracking-wide text-white/25">
              Active development · Feedback shapes the roadmap
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-black py-12">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 px-6 text-[11px] md:flex-row">
          <div className="flex items-center gap-3 text-white/30">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5">
              <img src="/lotus.svg" alt="" className="h-7 w-7 opacity-70" />
            </div>
            <span className="font-medium">&copy; {new Date().getFullYear()} Nascent</span>
          </div>
          <div className="flex items-center gap-6 font-mono uppercase tracking-wider">
            <a
              href="https://github.com/shaurya-afk/nascent"
              target="_blank"
              rel="noreferrer"
              className="text-white/30 transition-colors hover:text-white/60"
            >
              GitHub
            </a>
            <span className="text-white/15">Docs</span>
            <span className="text-white/10">·</span>
            <span className="text-white/15">Status</span>
          </div>
        </div>
      </footer>
    </main>
  );
}