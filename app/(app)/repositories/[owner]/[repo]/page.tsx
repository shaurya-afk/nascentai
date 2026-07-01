"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitBranch, Plus, MessageSquare, BarChart3, ArrowLeft } from "lucide-react";
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
          <Button onClick={startNewThread} variant="primary">
            <Plus className="h-4 w-4 mr-1.5" />
            New Thread
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Info Card */}
        <div className="lg:col-span-2 rounded-lg border border-border bg-surface p-6">
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Repository Details</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Owner</dt>
              <dd className="font-semibold text-white mt-1.5">{owner}</dd>
            </div>
            <div>
              <dt className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Repository</dt>
              <dd className="font-semibold text-white mt-1.5">{repo}</dd>
            </div>
            <div>
              <dt className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Default Branch</dt>
              <dd className="font-semibold text-white mt-1.5 flex items-center gap-1.5">
                <GitBranch className="h-3.5 w-3.5 text-neutral-500" />
                {repoInfo.defaultBranch ?? "main"}
              </dd>
            </div>
            <div>
              <dt className="text-neutral-500 text-[10px] uppercase tracking-wider font-semibold">Status</dt>
              <dd className="mt-1.5"><Badge variant="success">Connected</Badge></dd>
            </div>
          </dl>
        </div>

        {/* Stats Card */}
        <div className="rounded-lg border border-border bg-surface p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="h-4 w-4 text-neutral-400" />
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Statistics</h2>
          </div>
          <div className="space-y-4">
            <StatRow label="Threads" value={stats.threadCount} />
            <StatRow label="Pull Requests" value={stats.pullRequestCount} />
            <StatRow label="Last Activity" value={stats.lastActivity ? new Date(stats.lastActivity).toLocaleDateString() : "—"} />
          </div>
        </div>
      </div>

      {/* Threads Section */}
      <section className="mb-10">
        <div className="flex items-center gap-2.5 mb-6">
          <MessageSquare className="h-4 w-4 text-neutral-400" />
          <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Active Threads</h2>
        </div>
        {repoThreads.length === 0 ? (
          <EmptyState
            title="No active threads"
            description="Start a new thread to describe changes you want to make."
            actionLabel="Start New Thread"
            onAction={startNewThread}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {repoThreads.map((t) => (
              <ThreadCard key={t.id} thread={t} />
            ))}
          </div>
        )}
      </section>

      <div className="mt-8 border-t border-border/40 pt-6">
        <Link href="/repositories" className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-2 transition-colors uppercase tracking-wider">
          <ArrowLeft className="h-4 w-4" /> Back to repositories
        </Link>
      </div>
    </>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between text-sm py-1">
      <span className="text-neutral-400 font-medium">{label}</span>
      <span className="font-semibold text-white">{value}</span>
    </div>
  );
}
