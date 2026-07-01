import type { AgentResult, DiffReviewPayload, Plan, PlanReviewPayload } from "./agent";

export type ThreadStep =
  | "prompt"
  | "execution"
  | "plan"
  | "diff"
  | "commit"
  | "pr";

export type ExecutionStatus = "pending" | "running" | "completed" | "failed";
export type PlanStatus = "pending" | "generating" | "review" | "approved" | "rejected";
export type CommitStatus = "pending" | "created" | "none";
export type PullRequestStatus = "pending" | "created" | "none";

export interface ThreadRecord {
  id: string;
  repoUrl: string;
  repoName: string;
  userPrompt: string;
  createdAt: string;
  updatedAt: string;
  currentStep: ThreadStep;
  executionStatus: ExecutionStatus;
  planStatus: PlanStatus;
  commitStatus: CommitStatus;
  pullRequestStatus: PullRequestStatus;
  plan?: Plan;
  planPayload?: PlanReviewPayload;
  diffPayload?: DiffReviewPayload;
  result?: AgentResult;
  error?: string;
}

export interface ActivityEvent {
  id: string;
  type: "thread_started" | "plan_approved" | "plan_rejected" | "diff_approved" | "pr_created" | "thread_completed" | "error";
  title: string;
  description?: string;
  repoName?: string;
  threadId?: string;
  timestamp: string;
}
