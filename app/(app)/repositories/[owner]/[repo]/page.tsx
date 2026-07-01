"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitBranch, Plus, MessageSquare, BarChart3 } from "lucide-react";
import Header from "@/app/components/layout/Header";
import Button from "@/app/components/ui/Button";
import Badge from "@/app/components/ui/Badge";
import ThreadCard from "@/app/components/thread/ThreadCard";
import EmptyState from "@/app/components/ui/EmptyState";
import { repositoryService } from "@/app/services/repository.service";
import { threadStorageService } from "@/app/services/threadStorage.service";
import { useThreads } from "@/app/hooks/useThread";

export default function RepositoryOverviewPage({
  params,
}: {
  params: Promise<{ owner: string; repo: string }>;
}) {
  const { owner, repo } = use(params);
  const router = useRouter();
  const { threads } = useThreads();
  const fullName = `${owner}/${repo}`;

  const repoInfo = useMemo(
    () =>
      repositoryService.getRepositoryBySlug(owner, repo) ?? {
        url: `https://github.com/${fullName}`,
        owner,
        repo,
        fullName,
        defaultBranch: "main",
      },
    [owner, repo, fullName]
  );

  const stats = repositoryService.getStats(fullName);
  const repoThreads = threads.filter((t) => t.repoName === fullName);

  const startNewThread = () => {
    const threadId = crypto.randomUUID();
    threadStorageService.create({
      id: threadId,
      repoUrl: repoInfo.url,
      repoName: fullName,
      userPrompt: "",
    });
    repositoryService.saveRecentRepository(repoInfo.url);
    router.push(`/threads/${threadId}/prompt`);
  };

  return (
    <>
      <Header
        title={fullName}
        description={repoInfo.url}
        actions={
          <Button onClick={startNewThread}>
            <Plus className="h-4 w-4" />
            New Thread
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 rounded-xl border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold mb-4">Repository Information</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-muted text-xs">Owner</dt>
              <dd className="font-medium mt-1">{owner}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Repository</dt>
              <dd className="font-medium mt-1">{repo}</dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Default Branch</dt>
              <dd className="font-medium mt-1 flex items-center gap-1">
                <GitBranch className="h-3.5 w-3.5 text-muted" />
                {repoInfo.defaultBranch ?? "main"}
              </dd>
            </div>
            <div>
              <dt className="text-muted text-xs">Status</dt>
              <dd className="mt-1"><Badge variant="success">Connected</Badge></dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-4 w-4 text-muted" />
            <h2 className="text-sm font-semibold">Statistics</h2>
          </div>
          <div className="space-y-3">
            <StatRow label="Threads" value={stats.threadCount} />
            <StatRow label="Pull Requests" value={stats.pullRequestCount} />
            <StatRow label="Last Activity" value={stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : "—"} />
          </div>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4 text-muted" />
          <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Threads</h2>
        </div>
        {repoThreads.length === 0 ? (
          <EmptyState
            title="No threads for this repository"
            description="Start a new thread to describe changes you want to make."
            actionLabel="Start New Thread"
            onAction={startNewThread}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {repoThreads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-6">
        <Link href="/repositories" className="text-sm text-accent hover:underline">
          ← Back to repositories
        </Link>
      </div>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
