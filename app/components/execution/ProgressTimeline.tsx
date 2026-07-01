"use client";

import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react";
import { PIPELINE_STAGES, type PipelineStageId } from "@/app/lib/constants";
import { cn } from "@/app/lib/utils";
import type { ExecutionStatus } from "@/app/types/thread";

interface ProgressTimelineProps {
  currentStage: PipelineStageId;
  stageStatuses: Record<PipelineStageId, ExecutionStatus>;
  compact?: boolean;
}

function StageIcon({ status }: { status: ExecutionStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (status === "running") return <Loader2 className="h-4 w-4 text-accent animate-spin" />;
  if (status === "failed") return <XCircle className="h-4 w-4 text-danger" />;
  return <Circle className="h-4 w-4 text-muted" />;
}

export default function ProgressTimeline({
  currentStage,
  stageStatuses,
  compact,
}: ProgressTimelineProps) {
  const currentIdx = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);

  if (compact) {
    const stage = PIPELINE_STAGES[currentIdx] ?? PIPELINE_STAGES[0];
    const status = stageStatuses[stage.id] ?? "running";
    return (
      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3">
        <StageIcon status={status} />
        <div>
          <p className="text-sm font-medium">{stage.label}</p>
          <p className="text-xs text-muted">{stage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border bg-surface-elevated">
        <p className="text-sm font-medium">Pipeline Progress</p>
        <p className="text-xs text-muted mt-0.5">
          Step {Math.max(currentIdx + 1, 1)} of {PIPELINE_STAGES.length}
        </p>
      </div>
      <div className="p-4 space-y-1 max-h-[480px] overflow-y-auto">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = stageStatuses[stage.id] ?? (idx < currentIdx ? "completed" : idx === currentIdx ? "running" : "pending");
          const isActive = stage.id === currentStage;
          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors",
                isActive && "bg-accent/5 border border-accent/20",
                status === "completed" && !isActive && "opacity-70"
              )}
            >
              <StageIcon status={status} />
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-medium", isActive && "text-accent")}>
                  {stage.label}
                </p>
                <p className="text-xs text-muted">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function deriveStageStatuses(
  currentStep: string,
  executionStatus: ExecutionStatus
): { currentStage: PipelineStageId; statuses: Record<PipelineStageId, ExecutionStatus> } {
  const stageMap: Record<string, PipelineStageId> = {
    prompt: "load_repo",
    execution: "planner",
    plan: "plan_hitl",
    diff: "diff_hitl",
    commit: "git_commit",
    pr: "git_push",
  };

  const currentStage = stageMap[currentStep] ?? "load_repo";
  const currentIdx = PIPELINE_STAGES.findIndex((s) => s.id === currentStage);

  const statuses = {} as Record<PipelineStageId, ExecutionStatus>;
  PIPELINE_STAGES.forEach((stage, idx) => {
    if (executionStatus === "failed" && idx === currentIdx) {
      statuses[stage.id] = "failed";
    } else if (idx < currentIdx) {
      statuses[stage.id] = "completed";
    } else if (idx === currentIdx) {
      statuses[stage.id] = executionStatus === "completed" ? "completed" : "running";
    } else {
      statuses[stage.id] = "pending";
    }
  });

  return { currentStage, statuses };
}
