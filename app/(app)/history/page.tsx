"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/layout/Header";
import ThreadCard from "@/app/components/thread/ThreadCard";
import EmptyState from "@/app/components/ui/EmptyState";
import Badge from "@/app/components/ui/Badge";
import { useThreads } from "@/app/hooks/useThread";
import type { ThreadRecord } from "@/app/types/thread";

type FilterStatus = "all" | "active" | "completed" | "failed";

export default function HistoryPage() {
  const { threads } = useThreads();
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return threads.filter((t) => {
      const matchesSearch =
        t.repoName.toLowerCase().includes(search.toLowerCase()) ||
        t.userPrompt.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filter === "active") return t.pullRequestStatus !== "created" && t.executionStatus !== "failed";
      if (filter === "completed") return t.pullRequestStatus === "created";
      if (filter === "failed") return t.executionStatus === "failed";
      return true;
    });
  }, [threads, filter, search]);

  return (
    <>
      <Header
        title="History"
        description="Revisit previous threads, review their status, and continue where you left off."
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by repository or prompt…"
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
        <div className="flex gap-2 flex-wrap">
          {(["all", "active", "completed", "failed"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-2 text-xs font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-accent/10 text-accent ring-1 ring-accent/30"
                  : "bg-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No threads found"
          description="Start a new thread from a repository to see it here."
          actionLabel="Browse Repositories"
          onAction={() => (window.location.href = "/repositories")}
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((thread) => (
            <HistoryRow key={thread.id} thread={thread} />
          ))}
        </div>
      )}
    </>
  );
}

function HistoryRow({ thread }: { thread: ThreadRecord }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="p-4">
        <ThreadCard thread={thread} />
      </div>
      <div className="flex flex-wrap gap-2 px-4 pb-4 border-t border-border pt-3 bg-surface-elevated/50">
        <StatusPill label="Execution" value={thread.executionStatus} />
        <StatusPill label="Plan" value={thread.planStatus} />
        <StatusPill label="Commit" value={thread.commitStatus} />
        <StatusPill label="PR" value={thread.pullRequestStatus} />
        <span className="text-xs text-muted ml-auto self-center">
          Created {new Date(thread.createdAt).toLocaleDateString()}
        </span>
        <Link
          href={`/threads/${thread.id}/${thread.currentStep}`}
          className="text-xs text-accent hover:underline font-medium"
        >
          Reopen thread →
        </Link>
      </div>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  const variant =
    value === "completed" || value === "created" || value === "approved"
      ? "success"
      : value === "failed" || value === "rejected"
        ? "danger"
        : value === "running" || value === "review" || value === "generating"
          ? "info"
          : "muted";

  return (
    <Badge variant={variant}>
      {label}: {value}
    </Badge>
  );
}
