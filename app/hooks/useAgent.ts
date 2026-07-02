"use client";

import { useCallback, useState } from "react";
import axios from "axios";
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
        let message = "Failed to start agent";
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const detail = err.response?.data?.detail;
          if (
            status === 403 ||
            status === 404 ||
            (detail && typeof detail === "object" && detail.error === "repo_access_denied")
          ) {
            message =
              "The selected repository either does not exist or you do not have access to it. Please verify that the repository URL is correct and the Nascent GitHub App is installed.";
          } else if (detail && typeof detail === "object") {
            message = detail.message || detail.error || message;
          } else if (typeof detail === "string") {
            message = detail;
          } else if (err.response?.data?.message) {
            message = err.response.data.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }

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
        let message = "Failed to resume agent";
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          const detail = err.response?.data?.detail;
          if (
            status === 403 ||
            status === 404 ||
            (detail && typeof detail === "object" && detail.error === "repo_access_denied")
          ) {
            message =
              "The selected repository either does not exist or you do not have access to it. Please verify that the repository URL is correct and the Nascent GitHub App is installed.";
          } else if (detail && typeof detail === "object") {
            message = detail.message || detail.error || message;
          } else if (typeof detail === "string") {
            message = detail;
          } else if (err.response?.data?.message) {
            message = err.response.data.message;
          }
        } else if (err instanceof Error) {
          message = err.message;
        }
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
