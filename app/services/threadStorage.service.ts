import { STORAGE_KEYS } from "@/app/lib/constants";
import type { ActivityEvent, ThreadRecord } from "@/app/types/thread";

function readThreads(): ThreadRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.threads);
    return raw ? (JSON.parse(raw) as ThreadRecord[]) : [];
  } catch {
    return [];
  }
}

function writeThreads(threads: ThreadRecord[]) {
  localStorage.setItem(STORAGE_KEYS.threads, JSON.stringify(threads));
}

function readActivity(): ActivityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.activity);
    return raw ? (JSON.parse(raw) as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}

function writeActivity(events: ActivityEvent[]) {
  localStorage.setItem(STORAGE_KEYS.activity, JSON.stringify(events.slice(0, 100)));
}

export const threadStorageService = {
  getAll(): ThreadRecord[] {
    return readThreads().sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  },

  getById(id: string): ThreadRecord | null {
    return readThreads().find((t) => t.id === id) ?? null;
  },

  save(thread: ThreadRecord): ThreadRecord {
    const threads = readThreads();
    const idx = threads.findIndex((t) => t.id === thread.id);
    const updated = { ...thread, updatedAt: new Date().toISOString() };
    if (idx >= 0) threads[idx] = updated;
    else threads.unshift(updated);
    writeThreads(threads);
    return updated;
  },

  delete(id: string): void {
    writeThreads(readThreads().filter((t) => t.id !== id));
  },

  create(partial: Pick<ThreadRecord, "id" | "repoUrl" | "repoName" | "userPrompt">): ThreadRecord {
    const now = new Date().toISOString();
    const thread: ThreadRecord = {
      ...partial,
      createdAt: now,
      updatedAt: now,
      currentStep: "prompt",
      executionStatus: "pending",
      planStatus: "pending",
      commitStatus: "pending",
      pullRequestStatus: "pending",
    };
    return this.save(thread);
  },

  getActiveThreads(): ThreadRecord[] {
    return this.getAll().filter(
      (t) => t.pullRequestStatus !== "created" && t.executionStatus !== "failed"
    );
  },

  getRecentPullRequests(limit = 5): ThreadRecord[] {
    return this.getAll()
      .filter((t) => t.pullRequestStatus === "created" && t.result?.pull_request_url)
      .slice(0, limit);
  },

  addActivity(event: Omit<ActivityEvent, "id" | "timestamp">): void {
    const events = readActivity();
    events.unshift({
      ...event,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    });
    writeActivity(events);
  },

  getActivity(limit = 20): ActivityEvent[] {
    return readActivity().slice(0, limit);
  },
};
