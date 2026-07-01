"use client";

import Link from "next/link";
import { cn } from "@/app/lib/utils";
import type { ThreadStep } from "@/app/types/thread";
import { Check } from "lucide-react";

const STEPS: { id: ThreadStep; label: string }[] = [
  { id: "prompt", label: "Describe" },
  { id: "execution", label: "Execute" },
  { id: "plan", label: "Plan" },
  { id: "diff", label: "Review" },
  { id: "commit", label: "Commit" },
  { id: "pr", label: "PR" },
];

interface ThreadStepNavProps {
  threadId: string;
  currentStep: ThreadStep;
}

export default function ThreadStepNav({ threadId, currentStep }: ThreadStepNavProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav className="mb-8 overflow-x-auto">
      <ol className="flex items-center gap-2 min-w-max pb-1">
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIdx;
          const isCurrent = step.id === currentStep;
          const isFuture = idx > currentIdx;

          return (
            <li key={step.id} className="flex items-center">
              {idx > 0 && (
                <div
                  className={cn(
                    "h-px w-3 sm:w-6 mx-1 bg-border",
                    isComplete && "bg-neutral-600"
                  )}
                />
              )}
              <Link
                href={`/threads/${threadId}/${step.id}`}
                className={cn(
                  "flex items-center gap-2.5 rounded-lg border border-border px-3.5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all duration-200",
                  isCurrent && "bg-white text-black border-white shadow-sm",
                  isComplete && "bg-neutral-900 text-neutral-300 border-border hover:bg-neutral-850",
                  isFuture && "text-neutral-500 bg-neutral-950/40 pointer-events-none"
                )}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5 text-neutral-400" />
                ) : (
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-mono",
                      isCurrent ? "bg-black text-white" : "bg-neutral-900 text-neutral-500 border border-border"
                    )}
                  >
                    {idx + 1}
                  </span>
                )}
                <span>{step.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
