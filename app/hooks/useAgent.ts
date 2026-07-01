"use client";

import { useCallback, useState } from "react";
import { useToast } from "@/app/contexts/ToastContext";
import { threadStorageService } from "@/app/services/threadStorage.service";
import {
  startAgentWorkflow,
  resumeAgentWorkflow,
  getStepPath,
} from "@/app/services/agentWorkflow.service";
import type { ResumeAction } from "@/app/types/agent";
import type { ThreadStep } from "@/app/types/thread";

export function useAgentWorkflow(threadId: string | null) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const startAgent = useCallback(
    async (repoUrl: string, userQuery: string) => {
      if (!threadId) throw new Error("No thread ID");
      setLoading(true);
      try {
        return await startAgentWorkflow(threadId, repoUrl, userQuery);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to start agent";
        const thread = threadStorageService.getById(threadId);
        if (thread) {
          threadStorageService.save({ ...thread, executionStatus: "failed", error: message });
        }
        toast({ title: "Agent failed", description: message, variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [threadId, toast]
  );

  const resumeAgent = useCallback(
    async (id: string, action: ResumeAction, feedback = "") => {
      setLoading(true);
      try {
        return await resumeAgentWorkflow(id, action, feedback);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to resume agent";
        toast({ title: "Action failed", description: message, variant: "error" });
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  return { startAgent, resumeAgent, loading };
}

export { getStepPath };
