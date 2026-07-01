"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, FolderGit2, Plus } from "lucide-react";
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

      {/* Add Repository Panel */}
      <div className="mb-10 rounded-lg border border-border bg-surface p-8">
        <div className="flex items-center gap-3 mb-3">
          <FolderGit2 className="h-5 w-5 text-neutral-400" />
          <h2 className="text-sm font-semibold text-white uppercase tracking-wider">Add Repository</h2>
        </div>
        <p className="text-sm text-neutral-400 mb-6 leading-relaxed">
          Enter a GitHub repository URL to analyze its structure and start a new engineering thread.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/owner/repository"
            className="flex-1 rounded-lg border border-border bg-black px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
          />
          <Button onClick={handleAnalyze} className="py-3 px-6">Analyze Repository</Button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="mb-6 relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search connected repositories…"
          className="w-full rounded-lg border border-border bg-surface pl-11 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors"
        />
      </div>

      {/* Repositories Grid */}
      {filtered.length === 0 ? (
        <EmptyState
          title="No repositories found"
          description="Add a GitHub repository URL above to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map((repo) => (
            <div key={repo.fullName} className="flex flex-col gap-2">
              <RepositoryCard repo={repo} stats={repositoryService.getStats(repo.fullName)} />
              <Button
                variant="secondary"
                size="md"
                className="w-full font-semibold"
                onClick={() => startNewThread(repo.owner, repo.repo)}
              >
                <Plus className="h-4 w-4 mr-1.5" />
                Start New Thread
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
