export interface RepositoryInfo {
  url: string;
  owner: string;
  repo: string;
  fullName: string;
  defaultBranch?: string;
  lastAccessedAt?: string;
  threadCount?: number;
  description?: string;
  language?: string;
  isPrivate?: boolean;
}

export interface RepositoryStats {
  fileCount?: number;
  threadCount: number;
  pullRequestCount: number;
  lastActivity?: string;
}
