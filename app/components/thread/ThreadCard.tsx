import Link from "next/link";
import { MessageSquare, Clock, ArrowRight } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { formatRelativeTime, truncate } from "@/app/lib/utils";
import type { ThreadRecord } from "@/app/types/thread";

function statusBadge(thread: ThreadRecord) {
  if (thread.executionStatus === "failed") return <Badge variant="danger">Failed</Badge>;
  if (thread.pullRequestStatus === "created") return <Badge variant="success">PR Created</Badge>;
  if (thread.currentStep === "diff") return <Badge variant="warning">Review Diff</Badge>;
  if (thread.currentStep === "plan") return <Badge variant="info">Review Plan</Badge>;
  if (thread.executionStatus === "running") return <Badge variant="info">Running</Badge>;
  return <Badge variant="muted">In Progress</Badge>;
}

interface ThreadCardProps {
  thread: ThreadRecord;
  compact?: boolean;
}

export default function ThreadCard({ thread, compact }: ThreadCardProps) {
  const href = `/threads/${thread.id}/${thread.currentStep}`;

  return (
    <Link
      href={href}
      className="group block rounded-lg border border-border bg-surface p-6 transition-all duration-200 hover:border-neutral-500 hover:bg-hover animate-fade-in"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-neutral-500 shrink-0" />
            <span className="text-xs text-neutral-400 font-mono truncate">{thread.repoName}</span>
          </div>
          <p className={`font-semibold text-white tracking-tight leading-snug ${compact ? "text-sm truncate" : "text-base line-clamp-2"}`}>
            {truncate(thread.userPrompt, compact ? 85 : 180)}
          </p>
        </div>
        <div className="shrink-0">{statusBadge(thread)}</div>
      </div>

      <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-xs text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          {formatRelativeTime(thread.updatedAt)}
        </span>
        <span className="flex items-center gap-1 text-white opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-1 group-hover:translate-x-0 font-medium">
          Open thread <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
