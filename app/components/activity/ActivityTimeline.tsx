import { formatRelativeTime } from "@/app/lib/utils";
import type { ActivityEvent } from "@/app/types/thread";
import {
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Play,
  AlertCircle,
} from "lucide-react";

const iconMap = {
  thread_started: Play,
  plan_approved: CheckCircle2,
  plan_rejected: XCircle,
  diff_approved: CheckCircle2,
  pr_created: GitPullRequest,
  thread_completed: CheckCircle2,
  error: AlertCircle,
};

interface ActivityTimelineProps {
  events: ActivityEvent[];
}

export default function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return <p className="text-sm text-muted py-4">No recent activity</p>;
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const Icon = iconMap[event.type] ?? Play;
        const isLast = i === events.length - 1;
        return (
          <div key={event.id} className="flex gap-3 animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-elevated border border-border">
                <Icon className="h-4 w-4 text-muted" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1 min-h-[16px]" />}
            </div>
            <div className="pb-5 min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium">{event.title}</p>
                <span className="text-xs text-muted shrink-0">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
              {event.description && (
                <p className="mt-0.5 text-xs text-muted line-clamp-2">{event.description}</p>
              )}
              {event.repoName && (
                <p className="mt-1 text-xs text-accent">{event.repoName}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
