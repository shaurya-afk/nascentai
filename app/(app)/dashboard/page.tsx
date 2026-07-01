"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Plus, FolderSearch, History, GitPullRequest, ArrowRight } from "lucide-react";
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
      label: "Continue Previous Thread",
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
            <Button>
              <Plus className="h-4 w-4" />
              New Thread
            </Button>
          </Link>
        }
      />

      {!user?.github_installation_id && (
        <div className="mb-6 rounded-xl border border-warning/30 bg-warning/5 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-warning">GitHub App not installed</p>
            <p className="text-xs text-muted mt-1">
              Install the Nascent GitHub App to push branches and create pull requests.
            </p>
          </div>
          <Link href="/settings">
            <Button variant="secondary" size="sm">Connect GitHub</Button>
          </Link>
        </div>
      )}

      <section className="mb-8">
        <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(({ href, label, icon: Icon }) => (
            <Link
              key={label}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-border bg-surface p-4 hover:border-accent/40 hover:bg-surface-elevated transition-all group"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-sm font-medium group-hover:text-accent transition-colors">{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Recent Repositories</h2>
              <Link href="/repositories" className="text-xs text-accent hover:underline flex items-center gap-1">
                View all <ArrowRight className="h-3 w-3" />
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-medium text-muted uppercase tracking-wider">Active Threads</h2>
              <Badge variant="info">{activeThreads.length}</Badge>
            </div>
            {activeThreads.length === 0 ? (
              <EmptyState title="No active threads" description="Start a new thread from a repository." />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {activeThreads.map((t) => (
                  <ThreadCard key={t.id} thread={t} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-3">Recent Pull Requests</h2>
            {recentPRs.length === 0 ? (
              <EmptyState title="No pull requests yet" description="Complete a thread to create your first PR." />
            ) : (
              <div className="space-y-3">
                {recentPRs.map((t) => (
                  <Link
                    key={t.id}
                    href={`/threads/${t.id}/pr`}
                    className="flex items-center justify-between rounded-xl border border-border bg-surface p-4 hover:border-success/30 transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.plan?.summary ?? t.userPrompt}</p>
                      <p className="text-xs text-muted mt-1">{t.repoName}</p>
                    </div>
                    <Badge variant="success">PR Created</Badge>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside>
          <section className="rounded-xl border border-border bg-surface p-4 sticky top-6">
            <h2 className="text-sm font-medium text-muted uppercase tracking-wider mb-4">Activity</h2>
            <ActivityTimeline events={activity} />
          </section>
        </aside>
      </div>
    </>
  );
}
