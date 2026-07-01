import { STORAGE_KEYS } from "@/app/lib/constants";
import { parseRepoUrl } from "@/app/lib/utils";
import type { RepositoryInfo, RepositoryStats } from "@/app/types/repository";
import { threadStorageService } from "./threadStorage.service";

/**
 * Repository listing is not yet exposed by the backend.
 * This service derives data from local thread history and manual URL entry.
 * Replace list/get methods when backend endpoints are available.
 */
export const repositoryService = {
  getRecentRepositories(): RepositoryInfo[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.recentRepos);
      return raw ? (JSON.parse(raw) as RepositoryInfo[]) : [];
    } catch {
      return [];
    }
  },

  saveRecentRepository(url: string): RepositoryInfo | null {
    const parsed = parseRepoUrl(url);
    if (!parsed) return null;

    const info: RepositoryInfo = {
      url: url.replace(/\.git$/, ""),
      owner: parsed.owner,
      repo: parsed.repo,
      fullName: parsed.fullName,
      defaultBranch: "main",
      lastAccessedAt: new Date().toISOString(),
    };

    const existing = this.getRecentRepositories().filter((r) => r.fullName !== info.fullName);
    const updated = [info, ...existing].slice(0, 20);
    localStorage.setItem(STORAGE_KEYS.recentRepos, JSON.stringify(updated));
    return info;
  },

  getRepositoryBySlug(owner: string, repo: string): RepositoryInfo | null {
    const fullName = `${owner}/${repo}`;
    const recent = this.getRecentRepositories().find((r) => r.fullName === fullName);
    if (recent) return recent;

    const threads = threadStorageService.getAll().filter((t) => t.repoName === fullName);
    if (threads.length === 0) return null;

    return {
      url: threads[0].repoUrl,
      owner,
      repo,
      fullName,
      defaultBranch: "main",
      lastAccessedAt: threads[0].updatedAt,
    };
  },

  getStats(fullName: string): RepositoryStats {
    const threads = threadStorageService.getAll().filter((t) => t.repoName === fullName);
    const prs = threads.filter((t) => t.pullRequestStatus === "created");
    return {
      threadCount: threads.length,
      pullRequestCount: prs.length,
      lastActivity: threads[0]?.updatedAt,
    };
  },

  listFromThreads(): RepositoryInfo[] {
    const threads = threadStorageService.getAll();
    const map = new Map<string, RepositoryInfo>();

    for (const thread of threads) {
      const parsed = parseRepoUrl(thread.repoUrl);
      if (!parsed) continue;
      const existing = map.get(parsed.fullName);
      if (!existing || new Date(thread.updatedAt) > new Date(existing.lastAccessedAt ?? 0)) {
        map.set(parsed.fullName, {
          url: thread.repoUrl,
          owner: parsed.owner,
          repo: parsed.repo,
          fullName: parsed.fullName,
          defaultBranch: "main",
          lastAccessedAt: thread.updatedAt,
          threadCount: threads.filter((t) => t.repoName === parsed.fullName).length,
        });
      }
    }

    return Array.from(map.values()).sort(
      (a, b) => new Date(b.lastAccessedAt ?? 0).getTime() - new Date(a.lastAccessedAt ?? 0).getTime()
    );
  },
};
