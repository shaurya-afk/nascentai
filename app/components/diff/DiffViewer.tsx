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
      className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-neutral-900 transition-colors duration-200"
    >
      {expanded ? (
        <ChevronDown className="h-4 w-4 text-neutral-400 shrink-0" />
      ) : (
        <ChevronRight className="h-4 w-4 text-neutral-400 shrink-0" />
      )}
      <FileCode2 className="h-4 w-4 text-neutral-400 shrink-0" />
      <span className="font-mono text-sm font-medium text-white truncate flex-1">{file.path}</span>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={statusVariant} className="text-[10px] font-mono py-0">{file.status}</Badge>
        <span className="text-xs text-neutral-300 font-mono">+{file.additions}</span>
        <span className="text-xs text-neutral-500 font-mono">−{file.deletions}</span>
      </div>
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
      <div className="flex items-center justify-end gap-2 px-5 py-2 bg-neutral-900/60 border-b border-border">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy diff"}
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse font-mono text-xs leading-5">
          <tbody>
            {file.hunks.map((hunk, hi) => (
              <Fragment key={`hunk-${hi}`}>
                {/* Hunk Header */}
                <tr className="bg-neutral-950/60">
                  <td colSpan={3} className="px-5 py-1.5 text-neutral-500 select-none border-b border-border/40 text-[10px]">
                    {hunk.header}
                  </td>
                </tr>
                {hunk.lines.map((line, li) => (
                  <tr
                    key={`${hi}-${li}`}
                    className={cn(
                      "group hover:bg-neutral-900/30",
                      line.type === "addition" && "bg-emerald-950/20",
                      line.type === "deletion" && "bg-red-950/20"
                    )}
                  >
                    {/* Line numbers */}
                    <td className="w-10 px-3 py-0 text-right text-neutral-600 select-none border-r border-border/40 text-[10px]">
                      {line.oldLineNumber ?? ""}
                    </td>
                    <td className="w-10 px-3 py-0 text-right text-neutral-600 select-none border-r border-border/40 text-[10px]">
                      {line.newLineNumber ?? ""}
                    </td>
                    
                    {/* Line content */}
                    <td className="px-5 py-0 whitespace-pre">
                      <span
                        className={cn(
                          "font-mono text-xs text-neutral-350",
                          line.type === "addition" && "text-emerald-400 font-semibold",
                          line.type === "deletion" && "text-red-400 line-through"
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
    <div className="rounded-lg border border-border bg-surface overflow-hidden">
      <button
        onClick={() => setSectionOpen(!sectionOpen)}
        className="flex w-full items-center gap-3 px-5 py-3.5 bg-neutral-900/30 border-b border-border hover:bg-neutral-900 transition-colors duration-200"
      >
        {sectionOpen ? <ChevronDown className="h-4 w-4 text-neutral-400" /> : <ChevronRight className="h-4 w-4 text-neutral-400" />}
        <Icon className="h-4 w-4 text-neutral-400" />
        <span className="text-sm font-semibold flex-1 text-left text-white">{title}</span>
        <div className="flex items-center gap-3 shrink-0">
          <Badge variant="muted" className="text-[10px] font-mono py-0">{files.length} files</Badge>
          <span className="text-xs text-neutral-300 font-mono">+{totalAdd}</span>
          <span className="text-xs text-neutral-500 font-mono">−{totalDel}</span>
        </div>
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
      <div className={cn("rounded-lg border border-border bg-surface p-12 text-center text-sm text-neutral-550", className)}>
        No changes to display
      </div>
    );
  }

  return (
    <div className={cn("space-y-6 animate-fade-in", className)}>
      <div className="flex flex-wrap items-center gap-4 rounded-lg border border-border bg-surface px-5 py-3.5">
        <span className="text-sm font-semibold text-white">{parsed.files.length} files changed</span>
        <span className="flex items-center gap-1 text-sm text-neutral-300">
          <Plus className="h-4 w-4" />
          {parsed.totalAdditions} additions
        </span>
        <span className="flex items-center gap-1 text-sm text-neutral-500">
          <Minus className="h-4 w-4" />
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
    <div className="rounded-lg border border-border overflow-hidden">
      <div className="px-5 py-2.5 bg-neutral-900 border-b border-border font-mono text-xs text-neutral-300">
        {path}
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{ margin: 0, padding: "1.25rem", background: "#090909", fontSize: "12px" }}
        showLineNumbers
      >
        {content}
      </SyntaxHighlighter>
    </div>
  );
}
