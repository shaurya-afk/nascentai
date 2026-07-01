export interface FileOperation {
  path: string;
  operation: "modify" | "create" | "delete";
  reason: string;
}

export interface Plan {
  summary: string;
  modify: FileOperation[];
  create: FileOperation[];
  delete: FileOperation[];
  database_changes: string[];
  api_changes: string[];
}

export interface DiffSummary {
  files_changed: number | string;
  additions: number | string;
  deletions: number | string;
}

export interface GitDiff {
  patch: string;
  files: string[];
  summary: DiffSummary;
}

export interface PlanReviewPayload {
  type: "plan_review";
  repo_url: string;
  user_query: string;
  plan: Plan;
  message: string;
}

export interface DiffReviewPayload {
  type: "diff_review";
  repo_url: string;
  user_query: string;
  summary: DiffSummary;
  changed_files: string[];
  patch: string;
  message: string;
}

export type InterruptPayload = PlanReviewPayload | DiffReviewPayload;

export interface AgentResult {
  repo_url?: string;
  user_query?: string;
  plan?: Plan;
  diff?: GitDiff;
  commit_sha?: string;
  branch_name?: string;
  pull_request_url?: string;
}

export type AgentStatus =
  | "waiting_for_plan_approval"
  | "waiting"
  | "completed";

export interface StartAgentResponse {
  status: AgentStatus;
  thread_id: string;
  payload?: InterruptPayload;
  result?: AgentResult;
}

export interface ResumeAgentResponse {
  status: AgentStatus | "waiting";
  thread_id: string;
  payload?: InterruptPayload;
  result?: AgentResult;
}

export type ResumeAction = "approve" | "reject";
