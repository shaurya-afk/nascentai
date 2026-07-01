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
      className="group block rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/40 hover:bg-surface-elevated animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <MessageSquare className="h-4 w-4 text-muted shrink-0" />
            <span className="text-xs text-muted truncate">{thread.repoName}</span>
          </div>
          <p className={compact ? "text-sm font-medium truncate" : "text-sm font-medium line-clamp-2"}>
            {truncate(thread.userPrompt, compact ? 80 : 160)}
          </p>
        </div>
        {statusBadge(thread)}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-muted">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {formatRelativeTime(thread.updatedAt)}
        </span>
        <span className="flex items-center gap-1 text-accent opacity-0 group-hover:opacity-100 transition-opacity">
          Continue <ArrowRight className="h-3 w-3" />
        </span>
      </div>
    </Link>
  );
}
