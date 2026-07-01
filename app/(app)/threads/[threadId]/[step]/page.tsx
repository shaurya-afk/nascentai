import { Suspense } from "react";
import Skeleton from "@/app/components/ui/Skeleton";
import ThreadStepContent from "./ThreadStepContent";

export default function ThreadStepPage({
  params,
}: {
  params: Promise<{ threadId: string; step: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-96 w-full" />
        </div>
      }
    >
      <ThreadStepContent params={params} />
    </Suspense>
  );
}
