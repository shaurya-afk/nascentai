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
    return <p className="text-xs text-neutral-500 py-6 text-center italic">No recent activity</p>;
  }

  return (
    <div className="space-y-0">
      {events.map((event, i) => {
        const Icon = iconMap[event.type] ?? Play;
        const isLast = i === events.length - 1;
        return (
          <div key={event.id} className="flex gap-4 animate-fade-in">
            <div className="flex flex-col items-center">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 border border-border">
                <Icon className="h-3.5 w-3.5 text-neutral-400" />
              </div>
              {!isLast && <div className="w-px flex-1 bg-border my-1.5 min-h-[24px]" />}
            </div>
            <div className="pb-6 min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                  {formatRelativeTime(event.timestamp)}
                </span>
              </div>
              {event.description && (
                <p className="mt-1 text-xs text-neutral-400 leading-relaxed">{event.description}</p>
              )}
              {event.repoName && (
                <p className="mt-1 text-xs text-neutral-500 font-mono">{event.repoName}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
