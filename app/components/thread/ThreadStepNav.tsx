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
    <nav className="mb-6 overflow-x-auto">
      <ol className="flex items-center gap-1 min-w-max pb-1">
        {STEPS.map((step, idx) => {
          const isComplete = idx < currentIdx;
          const isCurrent = step.id === currentStep;
          const isFuture = idx > currentIdx;

          return (
            <li key={step.id} className="flex items-center">
              {idx > 0 && (
                <div
                  className={cn(
                    "h-px w-4 sm:w-8 mx-1",
                    isComplete ? "bg-success" : "bg-border"
                  )}
                />
              )}
              <Link
                href={`/threads/${threadId}/${step.id}`}
                className={cn(
                  "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium transition-colors sm:px-3 sm:text-sm",
                  isCurrent && "bg-accent/10 text-accent ring-1 ring-accent/30",
                  isComplete && "text-success hover:bg-success/5",
                  isFuture && "text-muted pointer-events-none"
                )}
              >
                {isComplete ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <span
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full text-[10px]",
                      isCurrent ? "bg-accent text-white" : "bg-surface-elevated text-muted"
                    )}
                  >
                    {idx + 1}
                  </span>
                )}
                <span className="hidden sm:inline">{step.label}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
