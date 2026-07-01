import api from "@/app/lib/api";
import type { ResumeAction, ResumeAgentResponse, StartAgentResponse } from "@/app/types/agent";

export const agentService = {
  async start(repoUrl: string, userQuery: string): Promise<StartAgentResponse> {
    const { data } = await api.post<StartAgentResponse>("/agent/start", {
      repo_url: repoUrl,
      user_query: userQuery,
    });
    return data;
  },

  async resume(threadId: string, action: ResumeAction, feedback = ""): Promise<ResumeAgentResponse> {
    const { data } = await api.post<ResumeAgentResponse>("/agent/resume", {
      thread_id: threadId,
      action,
      feedback,
    });
    return data;
  },

  async healthCheck(): Promise<boolean> {
    try {
      const { data } = await api.get<{ health: string }>("/health");
      return data.health === "ok";
    } catch {
      return false;
    }
  },
};
