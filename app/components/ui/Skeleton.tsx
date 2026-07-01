import { cn } from "@/app/lib/utils";

export default function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse-soft rounded-md bg-neutral-900 border border-border/50",
        className
      )}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-1/3" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-8 w-20 rounded" />
      </div>
    </div>
  );
}
