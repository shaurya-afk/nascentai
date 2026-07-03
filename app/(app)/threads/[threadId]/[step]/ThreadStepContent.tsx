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
import { CheckCircle2, XCircle, RotateCcw, FolderGit2, Info, Terminal } from "lucide-react";

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

  const handleRetry = () => {
    if (thread) {
      threadStorageService.save({
        ...thread,
        error: undefined,
        executionStatus: "pending",
      });
      refresh();
    }
  };

  if (!thread) {
    return (
      <>
        <Header title="Thread" description="Loading thread…" />
        <div className="rounded-lg border border-border bg-surface p-12 text-center text-neutral-400">
          Thread not found.{" "}
          <Link href="/repositories" className="text-white font-semibold hover:underline">
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

      {thread.error && (
        <div className="mb-6">
          <ErrorState message={thread.error} onRetry={handleRetry} />
        </div>
      )}

      {/* Main Cursor-meets-Linear Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 items-start mt-8">
        
        {/* Left Side: Conversation & Feedback Panel */}
        <div className="xl:col-span-1 space-y-6">
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="h-4.5 w-4.5 text-neutral-400" />
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Conversation</h3>
            </div>
            
            {thread.userPrompt ? (
              <div className="space-y-4">
                <div className="p-4 bg-black rounded-lg border border-border">
                  <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2 font-semibold">Prompt Request</p>
                  <p className="text-sm text-white font-medium leading-relaxed break-words">{thread.userPrompt}</p>
                </div>
                {thread.planPayload?.message && (
                  <div className="p-4 bg-neutral-900/40 rounded-lg border border-border">
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider mb-2 font-semibold">AI Assistant</p>
                    <p className="text-xs text-neutral-300 leading-relaxed">{thread.planPayload.message}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-xs text-neutral-500 italic">Describe your engineering request in the input field to initiate work.</p>
            )}
          </div>

          {/* Quick instructions / Help */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-4 w-4 text-neutral-400" />
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">Step Guidance</h3>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {step === "prompt" && "Input the feature description or issue you'd like Nascent to resolve. Be as specific as possible."}
              {step === "execution" && "The repository agent is running static analysis tools to locate files and construct the plan."}
              {step === "plan" && "Review the list of proposed modifications. Verify file creation, editing, or structural deletions."}
              {step === "diff" && "Inspect side-by-side or unified diff segments. Confirm code behavior satisfies requirements."}
              {step === "commit" && "The branches and commit have been written locally. Proceed to register the Pull Request."}
              {step === "pr" && "The workflow is successfully completed. Review code or merge branches directly on GitHub."}
            </p>
          </div>
        </div>

        {/* Center Panel: Plan, Diffs, Code View */}
        <div className="xl:col-span-2 space-y-6">
          {step === "prompt" && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-surface p-5 text-sm flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Selected Repository:</span>
                <Link
                  href={`/repositories/${owner}/${repo}`}
                  className="text-white hover:underline font-mono font-semibold truncate max-w-[280px]"
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
            <div className="rounded-lg border border-border bg-surface p-6">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-6">Workflow Execution</h3>
              <ProgressTimeline
                currentStage={stageInfo.currentStage}
                stageStatuses={stageInfo.statuses}
              />
              {thread.executionStatus === "running" && (
                <div className="mt-8 flex items-center justify-center gap-3 text-sm text-neutral-400 bg-black/40 border border-border py-4 rounded-lg">
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse-soft" />
                  Engineering agent is working on the codebase...
                </div>
              )}
              {thread.currentStep !== "execution" && thread.currentStep !== "prompt" && (
                <div className="mt-8">
                  <Button
                    className="w-full py-3"
                    onClick={() => router.push(`/threads/${threadId}/${thread.currentStep}`)}
                  >
                    Continue to {thread.currentStep}
                  </Button>
                </div>
              )}
            </div>
          )}

          {step === "plan" && thread.plan && (
            <div className="space-y-6">
              {thread.planPayload?.message && (
                <p className="text-sm text-neutral-400 leading-relaxed bg-surface border border-border p-4 rounded-lg">
                  {thread.planPayload.message}
                </p>
              )}
              <PlanCard plan={thread.plan} />
              
              <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-lg border border-border bg-surface sticky bottom-4 shadow-xl">
                <Button onClick={handleApprove} loading={loading} className="flex-1 py-3">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Plan
                </Button>
                <Button
                  variant="danger"
                  className="flex-1 py-3"
                  onClick={() => {
                    setRejectType("plan");
                    setFeedback("");
                    setRejectOpen(true);
                  }}
                  disabled={loading}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject Plan
                </Button>
              </div>
            </div>
          )}

          {step === "diff" && thread.diffPayload && (
            <div className="space-y-6">
              {thread.diffPayload.message && (
                <p className="text-sm text-neutral-400 leading-relaxed bg-surface border border-border p-4 rounded-lg">
                  {thread.diffPayload.message}
                </p>
              )}
              <DiffViewer patch={thread.diffPayload.patch} />
              
              <div className="flex flex-col sm:flex-row gap-4 p-5 rounded-lg border border-border bg-surface sticky bottom-4 shadow-xl">
                <Button onClick={handleApprove} loading={loading} className="flex-1 py-3">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve Changes
                </Button>
                <Button
                  variant="danger"
                  className="flex-1 py-3"
                  onClick={() => {
                    setRejectType("diff");
                    setFeedback("");
                    setRejectOpen(true);
                  }}
                  disabled={loading}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reject & Regenerate
                </Button>
              </div>
            </div>
          )}

          {step === "commit" && thread.result && (
            <div className="space-y-6">
              <CommitCard
                result={thread.result}
                repoName={thread.repoName}
                author={user?.github_username}
                timestamp={thread.updatedAt}
              />
              {thread.result.diff && <DiffViewer patch={thread.result.diff.patch} />}
            </div>
          )}

          {step === "pr" && thread.result && (
            <div className="space-y-6">
              <PullRequestCard result={thread.result} repoName={thread.repoName} />
            </div>
          )}
        </div>

        {/* Right Panel: Context Details, Lifecycle, Stats */}
        <div className="xl:col-span-1 space-y-6">
          {/* Workspace Details */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Workspace Info</h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-neutral-500 block font-medium mb-1">Target Repository</span>
                <Link
                  href={`/repositories/${owner}/${repo}`}
                  className="font-mono font-semibold text-white hover:underline break-all"
                >
                  {thread.repoUrl}
                </Link>
              </div>
              <div className="border-t border-border/60 pt-3.5">
                <span className="text-neutral-500 block font-medium mb-1">GitHub Owner</span>
                <span className="text-white font-semibold">{owner}</span>
              </div>
              <div className="border-t border-border/60 pt-3.5">
                <span className="text-neutral-500 block font-medium mb-1">Target Branch</span>
                <span className="text-white font-semibold font-mono">main</span>
              </div>
            </div>
          </div>

          {/* Plan Status Tracker */}
          <div className="rounded-lg border border-border bg-surface p-6">
            <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-widest mb-4">Status & State</h3>
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Step Phase</span>
                <Badge variant="info" className="uppercase tracking-wider font-mono py-0">{step}</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-border/40 pt-3">
                <span className="text-neutral-400 font-medium">Agent Status</span>
                <Badge
                  variant={thread.executionStatus === "failed" ? "danger" : thread.executionStatus === "completed" ? "success" : "warning"}
                  className="uppercase tracking-wider font-mono py-0"
                >
                  {thread.executionStatus}
                </Badge>
              </div>
              {thread.result?.branch_name && (
                <div className="border-t border-border/40 pt-3 space-y-1">
                  <span className="text-neutral-400 font-medium block">Working Branch</span>
                  <span className="text-white font-semibold font-mono block truncate">{thread.result.branch_name}</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Action Triggers */}
          {step === "commit" && thread.pullRequestStatus === "created" && (
            <Button className="w-full py-3 font-semibold" onClick={() => router.push(`/threads/${threadId}/pr`)}>
              View Pull Request
            </Button>
          )}

          {step === "pr" && (
            <div className="space-y-3">
              <Link href="/dashboard" className="block w-full">
                <Button variant="secondary" className="w-full py-3 font-semibold">
                  Back to Dashboard
                </Button>
              </Link>
              <Link href={`/repositories/${owner}/${repo}`} className="block w-full">
                <Button variant="ghost" className="w-full py-3 font-semibold">
                  Repository Workspace
                </Button>
              </Link>
            </div>
          )}
        </div>

      </div>

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
        confirmDisabled={!feedback.trim()}
        onConfirm={handleReject}
        onCancel={() => {
          setRejectOpen(false);
          setFeedback("");
        }}
      >
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Describe what should change…"
          rows={3}
          className="mt-4 w-full rounded-lg border border-border bg-surface p-4 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500 leading-relaxed"
        />
      </ConfirmDialog>
    </>
  );
}

function truncatePrompt(s: string): string {
  if (s.length <= 100) return s;
  return `${s.slice(0, 100)}…`;
}
