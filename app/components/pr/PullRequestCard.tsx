"use client";

import { GitPullRequest, ExternalLink, GitBranch, FolderGit2 } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import Button from "@/app/components/ui/Button";
import type { AgentResult } from "@/app/types/agent";

interface PullRequestCardProps {
  result: AgentResult;
  repoName: string;
}

export default function PullRequestCard({ result, repoName }: PullRequestCardProps) {
  const filesChanged = result.diff?.summary.files_changed ?? result.diff?.files.length ?? 0;
  const additions = result.diff?.summary.additions ?? 0;
  const deletions = result.diff?.summary.deletions ?? 0;

  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden animate-fade-in">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-neutral-900/40">
        <GitPullRequest className="h-5 w-5 text-white" />
        <h3 className="text-xs font-bold text-white uppercase tracking-widest">Pull Request Created</h3>
        <Badge variant="success" className="ml-auto text-[10px] font-bold uppercase tracking-wider py-0">Open</Badge>
      </div>

      <div className="p-6 space-y-6">
        <div>
          <p className="text-xl font-bold text-white tracking-tight leading-snug">{result.plan?.summary ?? "Pull Request"}</p>
          {result.user_query && (
            <p className="mt-3 text-sm text-neutral-400 leading-relaxed font-normal">{result.user_query}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          <InfoItem icon={FolderGit2} label="Repository" value={repoName} />
          <InfoItem icon={GitBranch} label="Source Branch" value={result.branch_name ?? "—"} />
          <InfoItem icon={GitBranch} label="Target Branch" value="main" />
          <InfoItem icon={GitPullRequest} label="Files Changed" value={String(filesChanged)} />
        </div>

        <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
          <Badge variant="success" className="text-[10px] font-mono py-0.5 px-2">+{additions} lines</Badge>
          <Badge variant="danger" className="text-[10px] font-mono py-0.5 px-2">−{deletions} lines</Badge>
        </div>

        {result.pull_request_url && (
          <div className="pt-4">
            <Button
              className="w-full sm:w-auto py-3 px-5 font-semibold text-xs"
              onClick={() => window.open(result.pull_request_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-1.5" />
              Open on GitHub
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
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
