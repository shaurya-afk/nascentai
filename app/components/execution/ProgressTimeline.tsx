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
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-white" />;
  if (status === "running") return <Loader2 className="h-4 w-4 text-white animate-spin" />;
  if (status === "failed") return <XCircle className="h-4 w-4 text-neutral-400" />;
  return <Circle className="h-4 w-4 text-neutral-600" />;
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
      <div className="flex items-center gap-3.5 rounded-lg border border-border bg-surface p-4">
        <StageIcon status={status} />
        <div>
          <p className="text-sm font-semibold text-white leading-none">{stage.label}</p>
          <p className="text-xs text-neutral-400 mt-1">{stage.description}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-neutral-900/40 flex justify-between items-center">
        <div>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Pipeline Progress</p>
          <p className="text-[10px] text-neutral-500 font-mono mt-1">
            Step {Math.max(currentIdx + 1, 1)} of {PIPELINE_STAGES.length}
          </p>
        </div>
        <Badge variant="muted" className="text-[9px] py-0 uppercase tracking-wider font-bold">Execution</Badge>
      </div>
      <div className="p-6 space-y-2.5 max-h-[500px] overflow-y-auto">
        {PIPELINE_STAGES.map((stage, idx) => {
          const status = stageStatuses[stage.id] ?? (idx < currentIdx ? "completed" : idx === currentIdx ? "running" : "pending");
          const isActive = stage.id === currentStage;
          return (
            <div
              key={stage.id}
              className={cn(
                "flex items-start gap-4 rounded-lg px-4 py-3.5 border border-transparent transition-all duration-200",
                isActive && "bg-neutral-900 border-neutral-600 shadow-sm",
                status === "completed" && !isActive && "opacity-60"
              )}
            >
              <div className="mt-0.5"><StageIcon status={status} /></div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm font-semibold text-neutral-400", isActive && "text-white")}>
                  {stage.label}
                </p>
                <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{stage.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import Badge from "@/app/components/ui/Badge";

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
