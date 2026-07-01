"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FolderGit2, Search, ArrowRight } from "lucide-react";
import Header from "@/app/components/layout/Header";
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

  const grouped = useMemo(() => {
    const groups: { [repo: string]: ThreadRecord[] } = {};
    filtered.forEach((t) => {
      if (!groups[t.repoName]) {
        groups[t.repoName] = [];
      }
      groups[t.repoName].push(t);
    });
    return groups;
  }, [filtered]);

  return (
    <>
      <Header
        title="History"
        description="Revisit previous threads, review their status, and continue where you left off."
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by repository or request…"
            className="w-full rounded-lg border border-border bg-surface pl-11 pr-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {(["all", "active", "completed", "failed"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold capitalize transition-all duration-150 ${
                filter === f
                  ? "bg-white text-black border border-white"
                  : "bg-surface border border-border text-neutral-400 hover:text-white hover:bg-hover"
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
        <div className="space-y-10">
          {Object.entries(grouped).map(([repoName, repoThreads]) => (
            <div key={repoName} className="rounded-lg border border-border bg-surface p-6">
              {/* Group Header */}
              <div className="flex items-center gap-2.5 mb-6 border-b border-border/60 pb-3">
                <FolderGit2 className="h-4.5 w-4.5 text-neutral-400" />
                <h3 className="font-mono text-sm font-semibold text-white tracking-tight">{repoName}</h3>
              </div>

              {/* Timeline Container */}
              <div className="space-y-0 pl-2">
                {repoThreads.map((thread) => (
                  <HistoryTimelineRow key={thread.id} thread={thread} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function HistoryTimelineRow({ thread }: { thread: ThreadRecord }) {
  return (
    <div className="relative pl-6 border-l border-border animate-fade-in group pb-2 last:pb-0">
      {/* Timeline Node */}
      <div className="absolute -left-[4.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-neutral-700 border border-black group-hover:bg-white transition-colors duration-200" />
      
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={`/threads/${thread.id}/${thread.currentStep}`}
            className="font-semibold text-white hover:text-neutral-300 text-base leading-snug group-hover:underline transition-colors block"
          >
            {thread.userPrompt || "Start of session / Initial repository analysis"}
          </Link>
          <div className="flex items-center gap-3 text-xs text-neutral-500 mt-2 font-mono">
            <span>Updated {new Date(thread.updatedAt).toLocaleString()}</span>
            <span>•</span>
            <span className="uppercase text-[10px] tracking-wider text-neutral-400 font-bold">Step: {thread.currentStep}</span>
          </div>
        </div>

        {/* Status Pills */}
        <div className="shrink-0 flex flex-wrap gap-1.5 items-center">
          <StatusPill label="Exec" value={thread.executionStatus} />
          <StatusPill label="Plan" value={thread.planStatus} />
          <StatusPill label="PR" value={thread.pullRequestStatus} />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs mt-3 pb-6">
        <Link
          href={`/threads/${thread.id}/${thread.currentStep}`}
          className="text-xs font-semibold text-neutral-400 hover:text-white flex items-center gap-1 transition-colors uppercase tracking-wider"
        >
          Open Workspace <ArrowRight className="h-3 w-3" />
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
    <Badge variant={variant} className="text-[10px] font-mono py-0 px-2 uppercase tracking-wide">
      {label}: {value}
    </Badge>
  );
}
