import Link from "next/link";
import { GitBranch, Clock, Lock, Globe, Code } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { formatRelativeTime } from "@/app/lib/utils";
import type { RepositoryInfo } from "@/app/types/repository";

interface RepositoryCardProps {
  repo: RepositoryInfo;
  stats?: { threadCount?: number; pullRequestCount?: number };
}

export default function RepositoryCard({ repo, stats }: RepositoryCardProps) {
  return (
    <Link
      href={`/repositories/${repo.owner}/${repo.repo}`}
      className="group block rounded-lg border border-border bg-surface p-6 transition-all duration-200 hover:border-neutral-500 hover:bg-hover animate-fade-in"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-lg text-white group-hover:text-neutral-200 transition-colors truncate">
              {repo.fullName}
            </h3>
            {repo.isPrivate ? (
              <Badge variant="muted" className="py-0 px-1.5 text-[10px]">
                <Lock className="h-2.5 w-2.5 mr-1" /> Private
              </Badge>
            ) : (
              <Badge variant="default" className="py-0 px-1.5 text-[10px]">
                <Globe className="h-2.5 w-2.5 mr-1" /> Public
              </Badge>
            )}
          </div>
          {repo.description ? (
            <p className="text-sm text-neutral-400 line-clamp-2 leading-relaxed mb-4">
              {repo.description}
            </p>
          ) : (
            <p className="text-sm text-neutral-500 italic mb-4">No description provided.</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border/60 text-xs">
        <div className="flex items-center gap-3">
          {repo.language && (
            <span className="flex items-center gap-1.5 text-neutral-400 font-medium">
              <Code className="h-3.5 w-3.5 text-neutral-500" />
              {repo.language}
            </span>
          )}
          <span className="flex items-center gap-1 text-neutral-500">
            <GitBranch className="h-3.5 w-3.5" />
            {repo.defaultBranch ?? "main"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {stats?.threadCount !== undefined && stats.threadCount > 0 && (
            <Badge variant="default">{stats.threadCount} Threads</Badge>
          )}
          {stats?.pullRequestCount !== undefined && stats.pullRequestCount > 0 && (
            <Badge variant="success">{stats.pullRequestCount} PRs</Badge>
          )}
          {repo.lastAccessedAt && (
            <span className="flex items-center gap-1 text-neutral-500 ml-1">
              <Clock className="h-3 w-3" />
              {formatRelativeTime(repo.lastAccessedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
