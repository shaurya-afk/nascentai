import { agentService } from "@/app/services/agent.service";
import { repositoryService } from "@/app/services/repository.service";
import { threadStorageService } from "@/app/services/threadStorage.service";
import type { ResumeAction, StartAgentResponse } from "@/app/types/agent";
import type { ThreadRecord, ThreadStep } from "@/app/types/thread";

export function mapResponseToThread(thread: ThreadRecord, response: StartAgentResponse): ThreadRecord {
  const updated: ThreadRecord = { ...thread };

  if (response.status === "waiting_for_plan_approval" && response.payload?.type === "plan_review") {
    updated.currentStep = "plan";
    updated.executionStatus = "completed";
    updated.planStatus = "review";
    updated.plan = response.payload.plan;
    updated.planPayload = response.payload;
  } else if (response.status === "waiting" && response.payload?.type === "diff_review") {
    updated.currentStep = "diff";
    updated.executionStatus = "completed";
    updated.planStatus = "approved";
    updated.diffPayload = response.payload;
  } else if (response.status === "completed" && response.result) {
    updated.result = response.result;
    updated.executionStatus = "completed";
    updated.planStatus = "approved";
    if (response.result.commit_sha) {
      updated.commitStatus = "created";
      updated.currentStep = "commit";
    }
    if (response.result.pull_request_url) {
      updated.pullRequestStatus = "created";
      updated.currentStep = "pr";
    }
    if (response.result.diff && !updated.diffPayload) {
      updated.diffPayload = {
        type: "diff_review",
        repo_url: response.result.repo_url ?? thread.repoUrl,
        user_query: response.result.user_query ?? thread.userPrompt,
        summary: response.result.diff.summary,
        changed_files: response.result.diff.files,
        patch: response.result.diff.patch,
        message: "Changes committed",
      };
    }
  }

  return updated;
}

export function getStepPath(threadId: string, step: ThreadStep): string {
  return `/threads/${threadId}/${step}`;
}

export async function startAgentWorkflow(
  localThreadId: string,
  repoUrl: string,
  userQuery: string
): Promise<ThreadRecord> {
  repositoryService.saveRecentRepository(repoUrl);

  let thread = threadStorageService.getById(localThreadId);
  if (!thread) {
    throw new Error("Thread not found");
  }

  threadStorageService.addActivity({
    type: "thread_started",
    title: "Thread started",
    description: userQuery,
    repoName: thread.repoName,
    threadId: localThreadId,
  });

  const running = threadStorageService.save({
    ...thread,
    userPrompt: userQuery,
    currentStep: "execution",
    executionStatus: "running",
    planStatus: "generating",
  });

  const response = await agentService.start(repoUrl, userQuery);

  if (response.thread_id !== localThreadId) {
    threadStorageService.delete(localThreadId);
    const migrated: ThreadRecord = { ...running, id: response.thread_id };
    const mapped = mapResponseToThread(migrated, response);
    return threadStorageService.save(mapped);
  }

  return threadStorageService.save(mapResponseToThread(running, response));
}

export async function resumeAgentWorkflow(
  threadId: string,
  action: ResumeAction,
  feedback = ""
): Promise<ThreadRecord> {
  const thread = threadStorageService.getById(threadId);
  if (!thread) throw new Error("Thread not found");

  if (action === "approve" && thread.currentStep === "plan") {
    threadStorageService.save({
      ...thread,
      currentStep: "execution",
      executionStatus: "running",
      planStatus: "approved",
    });
  }

  if (action === "reject" && thread.currentStep === "plan") {
    threadStorageService.save({ ...thread, planStatus: "rejected" });
    threadStorageService.addActivity({
      type: "plan_rejected",
      title: "Plan rejected",
      repoName: thread.repoName,
      threadId,
    });
  }

  if (action === "reject" && thread.currentStep === "diff") {
    threadStorageService.save({
      ...thread,
      currentStep: "execution",
      executionStatus: "running",
    });
  }

  const response = await agentService.resume(threadId, action, feedback);
  const current = threadStorageService.getById(threadId)!;
  const updated = threadStorageService.save(mapResponseToThread(current, response as StartAgentResponse));

  if (action === "approve" && updated.currentStep === "diff") {
    threadStorageService.addActivity({
      type: "plan_approved",
      title: "Plan approved — review diff",
      repoName: thread.repoName,
      threadId,
    });
  }

  if (action === "approve" && updated.currentStep === "pr") {
    threadStorageService.addActivity({
      type: "pr_created",
      title: "Pull request created",
      repoName: thread.repoName,
      threadId,
    });
  }

  return updated;
}
