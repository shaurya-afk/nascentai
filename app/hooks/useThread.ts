"use client";

import { useCallback, useEffect, useState } from "react";
import { threadStorageService } from "@/app/services/threadStorage.service";
import type { ThreadRecord } from "@/app/types/thread";

export function useThread(threadId: string | null) {
  const [thread, setThread] = useState<ThreadRecord | null>(null);

  const refresh = useCallback(() => {
    if (!threadId) {
      setThread(null);
      return;
    }
    setThread(threadStorageService.getById(threadId));
  }, [threadId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(
    (patch: Partial<ThreadRecord>) => {
      if (!threadId) return null;
      const current = threadStorageService.getById(threadId);
      if (!current) return null;
      const updated = threadStorageService.save({ ...current, ...patch });
      setThread(updated);
      return updated;
    },
    [threadId]
  );

  return { thread, refresh, update };
}

export function useThreads() {
  const [threads, setThreads] = useState<ThreadRecord[]>([]);

  const refresh = useCallback(() => {
    setThreads(threadStorageService.getAll());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { threads, refresh };
}
