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
    <div className="rounded-xl border border-success/30 bg-success-bg/30 overflow-hidden animate-fade-in">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-success/20 bg-success/5">
        <GitPullRequest className="h-5 w-5 text-success" />
        <h3 className="text-sm font-semibold text-success">Pull Request Created</h3>
        <Badge variant="success" className="ml-auto">Open</Badge>
      </div>

      <div className="p-6 space-y-5">
        <div>
          <p className="text-lg font-semibold">{result.plan?.summary ?? "Pull Request"}</p>
          {result.user_query && (
            <p className="mt-2 text-sm text-muted leading-relaxed">{result.user_query}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoItem icon={FolderGit2} label="Repository" value={repoName} />
          <InfoItem icon={GitBranch} label="Source Branch" value={result.branch_name ?? "—"} />
          <InfoItem icon={GitBranch} label="Target Branch" value="main" />
          <InfoItem icon={GitPullRequest} label="Files Changed" value={String(filesChanged)} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="success">+{additions} additions</Badge>
          <Badge variant="danger">−{deletions} deletions</Badge>
        </div>

        {result.pull_request_url && (
          <Button
            className="w-full sm:w-auto"
            onClick={() => window.open(result.pull_request_url, "_blank")}
          >
            <ExternalLink className="h-4 w-4" />
            Open on GitHub
          </Button>
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
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-muted mt-0.5" />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium font-mono">{value}</p>
      </div>
    </div>
  );
}
