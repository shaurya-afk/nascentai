"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderGit2 } from "lucide-react";
import Header from "@/app/components/layout/Header";
import RepositoryCard from "@/app/components/repository/RepositoryCard";
import EmptyState from "@/app/components/ui/EmptyState";
import Button from "@/app/components/ui/Button";
import { repositoryService } from "@/app/services/repository.service";
import { threadStorageService } from "@/app/services/threadStorage.service";
import { parseRepoUrl } from "@/app/lib/utils";
import { useToast } from "@/app/contexts/ToastContext";
import { useThreads } from "@/app/hooks/useThread";

export default function RepositoriesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { threads } = useThreads();
  const [url, setUrl] = useState("");
  const [search, setSearch] = useState("");

  const repos = useMemo(() => {
    const recent = repositoryService.getRecentRepositories();
    const fromThreads = repositoryService.listFromThreads();
    const map = new Map<string, typeof recent[0]>();
    [...recent, ...fromThreads].forEach((r) => map.set(r.fullName, r));
    return Array.from(map.values());
  }, [threads]);

  const filtered = repos.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.url.toLowerCase().includes(search.toLowerCase())
  );

  const handleAnalyze = () => {
    const trimmed = url.trim();
    if (!trimmed) return;
    const parsed = parseRepoUrl(trimmed);
    if (!parsed) {
      toast({ title: "Invalid URL", description: "Enter a valid GitHub repository URL.", variant: "error" });
      return;
    }
    repositoryService.saveRecentRepository(trimmed);
    router.push(`/repositories/${parsed.owner}/${parsed.repo}`);
  };

  const startNewThread = (owner: string, repo: string) => {
    const threadId = crypto.randomUUID();
    const repoInfo = repositoryService.getRepositoryBySlug(owner, repo);
    if (repoInfo) {
      threadStorageService.create({
        id: threadId,
        repoUrl: repoInfo.url,
        repoName: repoInfo.fullName,
        userPrompt: "",
      });
    }
    router.push(`/threads/${threadId}/prompt?owner=${owner}&repo=${repo}`);
  };

  return (
    <>
      <Header
        title="Repositories"
        description="Select a repository to analyze or continue an existing workspace."
      />

      <div className="mb-8 rounded-xl border border-border bg-surface p-4 sm:p-6">
        <div className="flex items-center gap-2 mb-4">
          <FolderGit2 className="h-5 w-5 text-muted" />
          <h2 className="text-sm font-semibold">Add Repository</h2>
        </div>
        <p className="text-sm text-muted mb-4">
          Enter a GitHub repository URL to analyze its structure and start a new engineering thread.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repository"
            className="flex-1 rounded-lg border border-border bg-surface-elevated px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <Button onClick={handleAnalyze}>Analyze Repository</Button>
        </div>
      </div>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search repositories…"
          className="w-full rounded-lg border border-border bg-surface pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No repositories found"
          description="Add a GitHub repository URL above to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((repo) => (
            <div key={repo.fullName} className="space-y-2">
              <RepositoryCard repo={repo} stats={repositoryService.getStats(repo.fullName)} />
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => startNewThread(repo.owner, repo.repo)}
              >
                Start New Thread
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
