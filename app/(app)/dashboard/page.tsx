"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus, FolderSearch, History, GitPullRequest, ArrowRight, AlertTriangle } from "lucide-react";
import Header from "@/app/components/layout/Header";
import Button from "@/app/components/ui/Button";
import RepositoryCard from "@/app/components/repository/RepositoryCard";
import ThreadCard from "@/app/components/thread/ThreadCard";
import ActivityTimeline from "@/app/components/activity/ActivityTimeline";
import EmptyState from "@/app/components/ui/EmptyState";
import { useAuth } from "@/app/contexts/AuthContext";
import { repositoryService } from "@/app/services/repository.service";
import { threadStorageService } from "@/app/services/threadStorage.service";
import { useThreads } from "@/app/hooks/useThread";
import Badge from "@/app/components/ui/Badge";

export default function DashboardPage() {
  const { user } = useAuth();
  const { threads } = useThreads();

  const recentRepos = useMemo(() => {
    const fromStorage = repositoryService.getRecentRepositories();
    const fromThreads = repositoryService.listFromThreads();
    const map = new Map<string, ReturnType<typeof repositoryService.getRecentRepositories>[0]>();
    [...fromStorage, ...fromThreads].forEach((r) => map.set(r.fullName, r));
    return Array.from(map.values()).slice(0, 6);
  }, [threads]);

  const activeThreads = useMemo(
    () => threads.filter((t) => t.pullRequestStatus !== "created").slice(0, 5),
    [threads]
  );

  const recentPRs = useMemo(() => threadStorageService.getRecentPullRequests(5), [threads]);
  const activity = useMemo(() => threadStorageService.getActivity(10), [threads]);

  const quickActions = [
    { href: "/repositories", label: "Analyze Repository", icon: FolderSearch },
    {
      href: activeThreads[0] ? `/threads/${activeThreads[0].id}/${activeThreads[0].currentStep}` : "/history",
      label: "Continue Thread",
      icon: History,
    },
    { href: "/repositories", label: "Start New Thread", icon: Plus },
    { href: "/history", label: "View History", icon: GitPullRequest },
  ];

  return (
    <>
      <Header
        title={`Welcome back${user ? `, ${user.github_username}` : ""}`}
        description="Your AI engineering workspace — pick up where you left off or start something new."
        actions={
          <Link href="/repositories">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-1.5" />
              New Thread
            </Button>
          </Link>
        }
      />

      {!user?.github_installation_id && (
        <div className="mb-8 rounded-lg border border-border bg-surface p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-neutral-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">GitHub App not installed</p>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                Install the Nascent GitHub App to push branches and automatically open pull requests.
              </p>
            </div>
          </div>
          <Link href="/settings" className="shrink-0">
            <Button variant="secondary" size="sm">Connect GitHub</Button>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3.5 rounded-lg border border-border bg-surface p-5 hover:border-neutral-500 hover:bg-hover transition-all duration-200 group"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 border border-border text-neutral-400 group-hover:text-white group-hover:border-neutral-500 transition-colors">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium text-neutral-300 group-hover:text-white transition-colors leading-tight">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-10">
          {/* Recent Repositories */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Recent Repositories</h2>
              <Link href="/repositories" className="text-xs text-white hover:underline flex items-center gap-1.5 font-medium">
                View all repositories <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {recentRepos.length === 0 ? (
              <EmptyState
                title="No repositories yet"
                description="Select a GitHub repository to begin your first thread."
                actionLabel="Browse Repositories"
                onAction={() => (window.location.href = "/repositories")}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recentRepos.map((repo) => (
                  <RepositoryCard
                    key={repo.fullName}
                    repo={repo}
                    stats={repositoryService.getStats(repo.fullName)}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Active Threads */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Active Threads</h2>
              <Badge variant="muted">{activeThreads.length}</Badge>
            </div>
            {activeThreads.length === 0 ? (
              <EmptyState
                title="No active threads"
                description="Initiate a new thread to start writing code."
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeThreads.map((t) => (
                  <ThreadCard key={t.id} thread={t} />
                ))}
              </div>
            )}
          </section>

          {/* Recent Pull Requests */}
          <section>
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Recent Pull Requests</h2>
            {recentPRs.length === 0 ? (
              <EmptyState
                title="No pull requests yet"
                description="Complete a thread to generate a pull request on GitHub."
              />
            ) : (
              <div className="space-y-3">
                {recentPRs.map((t) => (
                  <Link
                    key={t.id}
                    href={`/threads/${t.id}/pr`}
                    className="flex items-center justify-between rounded-lg border border-border bg-surface p-5 hover:border-neutral-500 hover:bg-hover transition-all duration-200"
                  >
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-semibold text-white truncate leading-snug">{t.plan?.summary ?? t.userPrompt}</p>
                      <p className="text-xs text-neutral-500 mt-1.5 font-mono">{t.repoName}</p>
                    </div>
                    <Badge variant="success">PR Created</Badge>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Activity Sidebar */}
        <aside className="xl:sticky xl:top-6">
          <section className="rounded-lg border border-border bg-surface p-6">
            <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-5">Activity</h2>
            <ActivityTimeline events={activity} />
          </section>
        </aside>
      </div>
    </>
  );
}
