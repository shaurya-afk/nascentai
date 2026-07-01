import { GitCommit, GitBranch, User, Clock, FileDiff } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import { shortSha } from "@/app/lib/utils";
import type { AgentResult } from "@/app/types/agent";

interface CommitCardProps {
  result: AgentResult;
  repoName: string;
  author?: string;
  timestamp?: string;
}

export default function CommitCard({ result, repoName, author, timestamp }: CommitCardProps) {
  const additions = result.diff?.summary.additions ?? 0;
  const deletions = result.diff?.summary.deletions ?? 0;
  const filesChanged = result.diff?.summary.files_changed ?? result.diff?.files.length ?? 0;

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-elevated">
        <GitCommit className="h-4 w-4 text-success" />
        <h3 className="text-sm font-semibold">Commit Summary</h3>
      </div>
      <div className="p-4 space-y-4">
        {result.commit_sha && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
              <GitCommit className="h-5 w-5 text-success" />
            </div>
            <div>
              <code className="text-sm font-mono text-accent">{shortSha(result.commit_sha)}</code>
              <p className="text-sm font-medium mt-0.5">{result.plan?.summary ?? "Commit created"}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <InfoRow icon={GitBranch} label="Repository" value={repoName} />
          {result.branch_name && (
            <InfoRow icon={GitBranch} label="Branch" value={result.branch_name} />
          )}
          {author && <InfoRow icon={User} label="Author" value={author} />}
          {timestamp && <InfoRow icon={Clock} label="Timestamp" value={timestamp} />}
        </div>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Badge variant="info">
            <FileDiff className="h-3 w-3 mr-1" />
            {filesChanged} files
          </Badge>
          <Badge variant="success">+{additions}</Badge>
          <Badge variant="danger">−{deletions}</Badge>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
