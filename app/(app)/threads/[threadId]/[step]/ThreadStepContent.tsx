"use client";

import { use, useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/app/components/layout/Header";
import ThreadStepNav from "@/app/components/thread/ThreadStepNav";
import PromptInput from "@/app/components/prompt/PromptInput";
import ProgressTimeline, { deriveStageStatuses } from "@/app/components/execution/ProgressTimeline";
import PlanCard from "@/app/components/plan/PlanCard";
import DiffViewer from "@/app/components/diff/DiffViewer";
import CommitCard from "@/app/components/commit/CommitCard";
import PullRequestCard from "@/app/components/pr/PullRequestCard";
import Button from "@/app/components/ui/Button";
import ConfirmDialog from "@/app/components/ui/ConfirmDialog";
import ErrorState from "@/app/components/ui/ErrorState";
import Badge from "@/app/components/ui/Badge";
import { useThread } from "@/app/hooks/useThread";
import { useAgentWorkflow } from "@/app/hooks/useAgent";
import { threadStorageService } from "@/app/services/threadStorage.service";
import { repositoryService } from "@/app/services/repository.service";
import type { ThreadStep } from "@/app/types/thread";
import { useAuth } from "@/app/contexts/AuthContext";
import { CheckCircle2, XCircle, RotateCcw } from "lucide-react";

const VALID_STEPS: ThreadStep[] = ["prompt", "execution", "plan", "diff", "commit", "pr"];

export default function ThreadStepContent({
  params,
}: {
  params: Promise<{ threadId: string; step: string }>;
}) {
  const { threadId, step: rawStep } = use(params);
  const step = (VALID_STEPS.includes(rawStep as ThreadStep) ? rawStep : "prompt") as ThreadStep;
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { thread, refresh } = useThread(threadId);
  const { startAgent, resumeAgent, loading } = useAgentWorkflow(threadId);

  const [prompt, setPrompt] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectType, setRejectType] = useState<"plan" | "diff">("plan");

  useEffect(() => {
    if (thread?.userPrompt) setPrompt(thread.userPrompt);
  }, [thread?.userPrompt]);

  useEffect(() => {
    const owner = searchParams.get("owner");
    const repo = searchParams.get("repo");
    if (!thread && owner && repo) {
      const repoInfo = repositoryService.getRepositoryBySlug(owner, repo);
      if (repoInfo) {
        threadStorageService.create({
          id: threadId,
          repoUrl: repoInfo.url,
          repoName: repoInfo.fullName,
          userPrompt: "",
        });
        refresh();
      }
    }
  }, [thread, threadId, searchParams, refresh]);

  const stageInfo = useMemo(() => {
    if (!thread) return deriveStageStatuses("prompt", "pending");
    return deriveStageStatuses(thread.currentStep, thread.executionStatus);
  }, [thread]);

  const handleStart = async () => {
    if (!thread?.repoUrl) return;
    try {
      const result = await startAgent(thread.repoUrl, prompt);
      router.push(`/threads/${result.id}/${result.currentStep}`);
    } catch {
      refresh();
    }
  };

  const handleApprove = async () => {
    try {
      const result = await resumeAgent(threadId, "approve");
      router.push(`/threads/${threadId}/${result.currentStep}`);
    } catch {
      refresh();
    }
  };

  const handleReject = async () => {
    try {
      const result = await resumeAgent(threadId, "reject", feedback);
      setRejectOpen(false);
      setFeedback("");
      router.push(`/threads/${threadId}/${result.currentStep}`);
    } catch {
      refresh();
    }
  };

  if (!thread) {
    return (
      <>
        <Header title="Thread" description="Loading thread…" />
        <div className="rounded-xl border border-border bg-surface p-8 text-center text-muted">
          Thread not found.{" "}
          <Link href="/repositories" className="text-accent hover:underline">
            Select a repository
          </Link>
        </div>
      </>
    );
  }

  const [owner, repo] = thread.repoName.split("/");

  return (
    <>
      <Header
        title={thread.repoName}
        description={truncatePrompt(thread.userPrompt || "New engineering thread")}
        actions={<Badge variant="muted">{thread.id.slice(0, 8)}</Badge>}
      />

      <ThreadStepNav threadId={threadId} currentStep={step} />

      {thread.error && step !== "prompt" && (
        <div className="mb-6">
          <ErrorState message={thread.error} onRetry={refresh} />
        </div>
      )}

      {step === "prompt" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="rounded-xl border border-border bg-surface p-4 text-sm">
            <span className="text-muted">Repository: </span>
            <Link
              href={`/repositories/${owner}/${repo}`}
              className="text-accent hover:underline font-mono"
            >
              {thread.repoUrl}
            </Link>
          </div>
          <PromptInput
            value={prompt}
            onChange={setPrompt}
            onSubmit={handleStart}
            loading={loading}
          />
        </div>
      )}

      {step === "execution" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ProgressTimeline
              currentStage={stageInfo.currentStage}
              stageStatuses={stageInfo.statuses}
            />
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <h3 className="text-sm font-semibold mb-3">Current Task</h3>
            <p className="text-sm text-muted leading-relaxed">{thread.userPrompt}</p>
            {thread.executionStatus === "running" && (
              <div className="mt-4 flex items-center gap-2 text-sm text-accent">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse-soft" />
                Agent is working…
              </div>
            )}
            {thread.currentStep !== "execution" && thread.currentStep !== "prompt" && (
              <Button
                className="mt-4 w-full"
                onClick={() => router.push(`/threads/${threadId}/${thread.currentStep}`)}
              >
                Continue to {thread.currentStep}
              </Button>
            )}
          </div>
        </div>
      )}

      {step === "plan" && thread.plan && (
        <div className="space-y-6 max-w-4xl">
          {thread.planPayload?.message && (
            <p className="text-sm text-muted">{thread.planPayload.message}</p>
          )}
          <PlanCard plan={thread.plan} />
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border">
            <Button onClick={handleApprove} loading={loading} className="flex-1">
              <CheckCircle2 className="h-4 w-4" />
              Approve Plan
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                setRejectType("plan");
                setRejectOpen(true);
              }}
              disabled={loading}
            >
              <XCircle className="h-4 w-4" />
              Reject Plan
            </Button>
          </div>
        </div>
      )}

      {step === "diff" && thread.diffPayload && (
        <div className="space-y-6">
          {thread.diffPayload.message && (
            <p className="text-sm text-muted">{thread.diffPayload.message}</p>
          )}
          <DiffViewer patch={thread.diffPayload.patch} />
          <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border">
            <Button onClick={handleApprove} loading={loading} className="flex-1">
              <CheckCircle2 className="h-4 w-4" />
              Approve Changes
            </Button>
            <Button
              variant="danger"
              className="flex-1"
              onClick={() => {
                setRejectType("diff");
                setRejectOpen(true);
              }}
              disabled={loading}
            >
              <RotateCcw className="h-4 w-4" />
              Reject & Regenerate
            </Button>
          </div>
        </div>
      )}

      {step === "commit" && thread.result && (
        <div className="max-w-2xl mx-auto space-y-6">
          <CommitCard
            result={thread.result}
            repoName={thread.repoName}
            author={user?.github_username}
            timestamp={thread.updatedAt}
          />
          {thread.result.diff && <DiffViewer patch={thread.result.diff.patch} />}
          {thread.pullRequestStatus === "created" && (
            <Button className="w-full" onClick={() => router.push(`/threads/${threadId}/pr`)}>
              View Pull Request
            </Button>
          )}
        </div>
      )}

      {step === "pr" && thread.result && (
        <div className="max-w-2xl mx-auto space-y-6">
          <PullRequestCard result={thread.result} repoName={thread.repoName} />
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/dashboard" className="flex-1">
              <Button variant="secondary" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
            <Link href={`/repositories/${owner}/${repo}`} className="flex-1">
              <Button variant="ghost" className="w-full">
                Repository Workspace
              </Button>
            </Link>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={rejectOpen}
        title={rejectType === "plan" ? "Reject Plan" : "Reject Changes"}
        description={
          rejectType === "plan"
            ? "Provide feedback to regenerate the plan."
            : "Provide feedback to regenerate the implementation."
        }
        confirmLabel="Submit Feedback"
        variant="danger"
        loading={loading}
        onConfirm={handleReject}
        onCancel={() => setRejectOpen(false)}
      />

      {rejectOpen && (
        <div className="fixed inset-x-4 bottom-24 z-40 mx-auto max-w-lg">
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Describe what should change…"
            rows={3}
            className="w-full rounded-lg border border-border bg-surface p-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 shadow-xl"
          />
        </div>
      )}
    </>
  );
}

function truncatePrompt(s: string): string {
  if (s.length <= 100) return s;
  return `${s.slice(0, 100)}…`;
}
