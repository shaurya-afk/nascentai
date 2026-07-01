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
  actionText,
}: {
  title: string;
  icon: React.ElementType;
  items: { path: string; reason: string }[];
  variant: "info" | "success" | "danger";
  actionText: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border/80 pb-2">
        <Icon className="h-4 w-4 text-neutral-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h4>
        <Badge variant={variant} className="text-[10px] font-mono font-bold py-0">{items.length}</Badge>
      </div>
      <ul className="space-y-3">
        {items.map((item) => (
          <li
            key={item.path}
            className="rounded-lg border border-border bg-surface p-4 hover:border-neutral-500 transition-colors duration-200"
          >
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <code className="text-xs font-mono text-white bg-neutral-900 border border-border px-2 py-0.5 rounded break-all">{item.path}</code>
              <Badge variant="muted" className="text-[9px] uppercase tracking-wider font-bold py-0">{actionText}</Badge>
            </div>
            <p className="mt-2.5 text-xs text-neutral-400 leading-relaxed font-normal">{item.reason}</p>
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
    <div className="space-y-4">
      <div className="flex items-center gap-3 border-b border-border/80 pb-2">
        <Icon className="h-4 w-4 text-neutral-400" />
        <h4 className="text-xs font-bold text-white uppercase tracking-widest">{title}</h4>
      </div>
      <ul className="space-y-2.5 pl-1">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-3 text-xs text-neutral-400 leading-relaxed">
            <span className="h-1.5 w-1.5 rounded-full bg-neutral-500 mt-1.5 shrink-0" />
            <span className="font-normal">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlanCard({ plan, showHeader = true }: PlanCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface overflow-hidden animate-fade-in">
      {showHeader && (
        <div className="px-6 py-4 border-b border-border bg-neutral-900/50 flex items-center justify-between">
          <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Implementation Plan</h3>
          <span className="text-[10px] font-mono text-neutral-500 uppercase tracking-wider">AI Software Engineer</span>
        </div>
      )}
      <div className="p-6 space-y-8">
        {/* Large typography summary */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Objective & Summary</h4>
          <div className="border-l-2 border-white pl-4 my-4">
            <p className="text-base text-neutral-200 leading-relaxed font-medium font-sans">
              {plan.summary}
            </p>
          </div>
        </div>

        {/* Affected Files */}
        <div className="space-y-8">
          <FileList title="Files to Create" icon={FilePlus} items={plan.create ?? []} variant="success" actionText="Create" />
          <FileList title="Files to Modify" icon={FileEdit} items={plan.modify ?? []} variant="info" actionText="Modify" />
          <FileList title="Files to Delete" icon={FileX} items={plan.delete ?? []} variant="danger" actionText="Delete" />
        </div>

        {/* Database & API changes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-border/40">
          <ChangeList title="Database Changes" icon={Database} items={plan.database_changes ?? []} />
          <ChangeList title="API Changes" icon={Globe} items={plan.api_changes ?? []} />
        </div>

        {(plan.modify?.length ?? 0) + (plan.create?.length ?? 0) === 0 && (
          <div className="flex items-center gap-3 rounded-lg border border-border bg-neutral-900/50 p-4 text-xs text-neutral-400 leading-relaxed">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-neutral-500" />
            No file operations defined in this implementation plan.
          </div>
        )}
      </div>
    </div>
  );
}
