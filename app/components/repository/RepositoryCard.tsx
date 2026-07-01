import Link from "next/link";
import { FolderGit2, GitBranch, Clock } from "lucide-react";
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
      className="group block rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/40 hover:bg-surface-elevated animate-fade-in"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <FolderGit2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold group-hover:text-accent transition-colors">
              {repo.fullName}
            </p>
            <p className="truncate text-xs text-muted">{repo.url}</p>
          </div>
        </div>
        {repo.lastAccessedAt && (
          <span className="flex items-center gap-1 text-xs text-muted shrink-0">
            <Clock className="h-3 w-3" />
            {formatRelativeTime(repo.lastAccessedAt)}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Badge variant="muted">
          <GitBranch className="h-3 w-3 mr-1" />
          {repo.defaultBranch ?? "main"}
        </Badge>
        {stats?.threadCount !== undefined && (
          <Badge variant="info">{stats.threadCount} threads</Badge>
        )}
        {stats?.pullRequestCount !== undefined && stats.pullRequestCount > 0 && (
          <Badge variant="success">{stats.pullRequestCount} PRs</Badge>
        )}
      </div>
    </Link>
  );
}
