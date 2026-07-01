"use client";

import { useState, useMemo, Fragment } from "react";
import {
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  FileCode2,
  Plus,
  Minus,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { parseUnifiedDiff, getLanguageFromPath } from "@/app/lib/diffParser";
import { cn } from "@/app/lib/utils";
import Badge from "@/app/components/ui/Badge";
import type { ParsedDiffFile } from "@/app/types/diff";

interface DiffViewerProps {
  patch: string;
  className?: string;
}

function DiffFileHeader({
  file,
  expanded,
  onToggle,
}: {
  file: ParsedDiffFile;
  expanded: boolean;
  onToggle: () => void;
}) {
  const statusVariant = file.status === "added" ? "success" : file.status === "deleted" ? "danger" : "info";

  return (
    <button
      onClick={onToggle}
      className="flex w-full items-center gap-2 px-4 py-2.5 text-left hover:bg-surface-elevated transition-colors"
    >
      {expanded ? (
        <ChevronDown className="h-4 w-4 text-muted shrink-0" />
      ) : (
        <ChevronRight className="h-4 w-4 text-muted shrink-0" />
      )}
      <FileCode2 className="h-4 w-4 text-muted shrink-0" />
      <span className="font-mono text-sm truncate flex-1">{file.path}</span>
      <Badge variant={statusVariant}>{file.status}</Badge>
      <span className="text-xs text-success font-mono">+{file.additions}</span>
      <span className="text-xs text-danger font-mono">−{file.deletions}</span>
    </button>
  );
}

function DiffFileContent({ file }: { file: ParsedDiffFile }) {
  const [copied, setCopied] = useState(false);

  const fullContent = useMemo(() => {
    const lines: string[] = [];
    for (const hunk of file.hunks) {
      for (const line of hunk.lines) {
        const prefix = line.type === "addition" ? "+" : line.type === "deletion" ? "-" : " ";
        lines.push(`${prefix}${line.content}`);
      }
    }
    return lines.join("\n");
  }, [file]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(fullContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="border-t border-border">
      <div className="flex items-center justify-end gap-2 px-4 py-1.5 bg-surface-elevated border-b border-border">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-success" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy diff"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs leading-5">
          <tbody>
            {file.hunks.map((hunk, hi) => (
              <Fragment key={`hunk-${hi}`}>
                <tr className="bg-accent/5">
                  <td colSpan={3} className="px-4 py-1 text-accent/80 select-none">
                    {hunk.header}
                  </td>
                </tr>
                {hunk.lines.map((line, li) => (
                  <tr
                    key={`${hi}-${li}`}
                    className={cn(
                      line.type === "addition" && "bg-success-bg",
                      line.type === "deletion" && "bg-danger-bg"
                    )}
                  >
                    <td className="w-10 px-2 py-0 text-right text-muted select-none border-r border-border/50">
                      {line.oldLineNumber ?? ""}
                    </td>
                    <td className="w-10 px-2 py-0 text-right text-muted select-none border-r border-border/50">
                      {line.newLineNumber ?? ""}
                    </td>
                    <td className="px-4 py-0 whitespace-pre">
                      <span
                        className={cn(
                          line.type === "addition" && "text-success",
                          line.type === "deletion" && "text-danger"
                        )}
                      >
                        {line.type === "addition" ? "+" : line.type === "deletion" ? "−" : " "}
                        {line.content}
                      </span>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DiffSection({
  title,
  icon: Icon,
  files,
  defaultExpanded,
}: {
  title: string;
  icon: React.ElementType;
  files: ParsedDiffFile[];
  defaultExpanded?: boolean;
}) {
  const [sectionOpen, setSectionOpen] = useState(defaultExpanded ?? true);
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(
    () => new Set(files.map((f) => f.path))
  );

  if (files.length === 0) return null;

  const totalAdd = files.reduce((s, f) => s + f.additions, 0);
  const totalDel = files.reduce((s, f) => s + f.deletions, 0);

  const toggleFile = (path: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <button
        onClick={() => setSectionOpen(!sectionOpen)}
        className="flex w-full items-center gap-3 px-4 py-3 bg-surface-elevated border-b border-border hover:bg-border-muted transition-colors"
      >
        {sectionOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        <Icon className="h-4 w-4 text-muted" />
        <span className="text-sm font-semibold flex-1 text-left">{title}</span>
        <Badge variant="muted">{files.length} files</Badge>
        <span className="text-xs text-success font-mono">+{totalAdd}</span>
        <span className="text-xs text-danger font-mono">−{totalDel}</span>
      </button>
      {sectionOpen && (
        <div className="divide-y divide-border">
          {files.map((file) => (
            <div key={file.path}>
              <DiffFileHeader
                file={file}
                expanded={expandedFiles.has(file.path)}
                onToggle={() => toggleFile(file.path)}
              />
              {expandedFiles.has(file.path) && <DiffFileContent file={file} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiffViewer({ patch, className }: DiffViewerProps) {
  const parsed = useMemo(() => parseUnifiedDiff(patch), [patch]);

  if (parsed.files.length === 0) {
    return (
      <div className={cn("rounded-xl border border-border bg-surface p-8 text-center text-sm text-muted", className)}>
        No changes to display
      </div>
    );
  }

  return (
    <div className={cn("space-y-4 animate-fade-in", className)}>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <span className="text-sm font-medium">{parsed.files.length} files changed</span>
        <span className="flex items-center gap-1 text-sm text-success">
          <Plus className="h-3.5 w-3.5" />
          {parsed.totalAdditions} additions
        </span>
        <span className="flex items-center gap-1 text-sm text-danger">
          <Minus className="h-3.5 w-3.5" />
          {parsed.totalDeletions} deletions
        </span>
      </div>

      <DiffSection title="Modified Files" icon={FileCode2} files={parsed.modified} />
      <DiffSection title="New Files" icon={Plus} files={parsed.added} />
      <DiffSection title="Deleted Files" icon={Minus} files={parsed.deleted} />
    </div>
  );
}

export function FullFileViewer({ path, content }: { path: string; content: string }) {
  const language = getLanguageFromPath(path);
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-2 bg-surface-elevated border-b border-border font-mono text-xs">
        {path}
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1rem", background: "#0d1117", fontSize: "12px" }}
        showLineNumbers
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
