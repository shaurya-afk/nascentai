export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

export const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/github/login`,
  me: "/auth/me",
  logout: "/auth/logout",
  install: `${API_BASE_URL}/auth/github/install`,
} as const;

export const PIPELINE_STAGES = [
  { id: "load_repo", label: "Load Repository", description: "Checking repository cache" },
  { id: "repo_extract", label: "Extract Repository", description: "Analyzing repository structure" },
  { id: "planner", label: "Generate Plan", description: "Creating implementation plan" },
  { id: "clone_repo", label: "Clone Repository", description: "Cloning repository locally" },
  { id: "context_loader", label: "Load Context", description: "Loading relevant file context" },
  { id: "plan_hitl", label: "Plan Review", description: "Awaiting plan approval" },
  { id: "gen_code", label: "Generate Code", description: "Implementing approved changes" },
  { id: "diff", label: "Generate Diff", description: "Computing file changes" },
  { id: "diff_hitl", label: "Diff Review", description: "Awaiting diff approval" },
  { id: "git_commit", label: "Create Commit", description: "Committing changes" },
  { id: "git_push", label: "Push & Create PR", description: "Pushing branch and opening pull request" },
] as const;

export type PipelineStageId = (typeof PIPELINE_STAGES)[number]["id"];

export const STORAGE_KEYS = {
  threads: "nascent_threads",
  recentRepos: "nascent_recent_repos",
  activity: "nascent_activity",
} as const;
