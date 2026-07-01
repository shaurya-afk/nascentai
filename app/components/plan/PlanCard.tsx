import { FileEdit, FilePlus, FileX, Database, Globe, AlertTriangle } from "lucide-react";
import Badge from "@/app/components/ui/Badge";
import type { Plan } from "@/app/types/agent";

interface PlanCardProps {
  plan: Plan;
  showHeader?: boolean;
}

function FileList({
  title,
  icon: Icon,
  items,
  variant,
}: {
  title: string;
  icon: React.ElementType;
  items: { path: string; reason: string }[];
  variant: "info" | "success" | "danger";
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted" />
        <h4 className="text-sm font-medium">{title}</h4>
        <Badge variant={variant}>{items.length}</Badge>
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.path}
            className="rounded-lg border border-border bg-surface-elevated px-3 py-2"
          >
            <code className="text-xs font-mono text-accent">{item.path}</code>
            <p className="mt-1 text-xs text-muted">{item.reason}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ChangeList({
  title,
  icon: Icon,
  items,
}: {
  title: string;
  icon: React.ElementType;
  items: string[];
}) {
  if (items.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-4 w-4 text-muted" />
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-muted">
            <span className="text-accent mt-1">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlanCard({ plan, showHeader = true }: PlanCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden animate-fade-in">
      {showHeader && (
        <div className="px-4 py-3 border-b border-border bg-surface-elevated">
          <h3 className="text-sm font-semibold">Implementation Plan</h3>
        </div>
      )}
      <div className="p-4 space-y-6">
        <div>
          <h4 className="text-xs font-medium uppercase tracking-wider text-muted mb-2">Summary</h4>
          <p className="text-sm leading-relaxed">{plan.summary}</p>
        </div>

        <FileList title="Files to Modify" icon={FileEdit} items={plan.modify ?? []} variant="info" />
        <FileList title="Files to Create" icon={FilePlus} items={plan.create ?? []} variant="success" />
        <FileList title="Files to Delete" icon={FileX} items={plan.delete ?? []} variant="danger" />

        <ChangeList title="Database Changes" icon={Database} items={plan.database_changes ?? []} />
        <ChangeList title="API Changes" icon={Globe} items={plan.api_changes ?? []} />

        {(plan.modify?.length ?? 0) + (plan.create?.length ?? 0) === 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm text-warning">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            No file operations defined in this plan.
          </div>
        )}
      </div>
    </div>
  );
}
