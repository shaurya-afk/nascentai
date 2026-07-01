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
    <div className="rounded-lg border border-border bg-surface p-6 animate-fade-in">
      <div className="flex items-center gap-2 border-b border-border pb-4 mb-6">
        <GitCommit className="h-4.5 w-4.5 text-neutral-400" />
        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Commit Summary</h3>
      </div>

      <div className="space-y-6">
        {result.commit_sha && (
          <div className="rounded-lg border border-border bg-black p-4 flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-neutral-900 border border-border">
              <GitCommit className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0">
              <code className="text-xs font-mono font-bold text-white bg-neutral-900 border border-border px-2 py-0.5 rounded">
                {shortSha(result.commit_sha)}
              </code>
              <p className="text-sm font-semibold text-white mt-2 leading-relaxed">{result.plan?.summary ?? "Commit created"}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <InfoRow icon={GitBranch} label="Repository" value={repoName} />
          {result.branch_name && (
            <InfoRow icon={GitBranch} label="Working Branch" value={result.branch_name} />
          )}
          {author && <InfoRow icon={User} label="Committer" value={author} />}
          {timestamp && <InfoRow icon={Clock} label="Timestamp" value={new Date(timestamp).toLocaleString()} />}
        </div>

        <div className="flex flex-wrap gap-2 pt-5 border-t border-border/60">
          <Badge variant="info" className="text-[10px] font-mono py-0.5 px-2">
            <FileDiff className="h-3 w-3 mr-1" />
            {filesChanged} files changed
          </Badge>
          <Badge variant="success" className="text-[10px] font-mono py-0.5 px-2">+{additions} lines</Badge>
          <Badge variant="danger" className="text-[10px] font-mono py-0.5 px-2">−{deletions} lines</Badge>
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
    <div className="flex items-start gap-3">
      <Icon className="h-4.5 w-4.5 text-neutral-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">{label}</p>
        <p className="text-sm font-semibold text-white mt-1 truncate font-mono">{value}</p>
      </div>
    </div>
  );
}
