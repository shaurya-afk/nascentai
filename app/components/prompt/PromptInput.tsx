"use client";

import { Send, Sparkles } from "lucide-react";
import Button from "@/app/components/ui/Button";
import { cn } from "@/app/lib/utils";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading?: boolean;
  placeholder?: string;
  label?: string;
  className?: string;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  loading,
  placeholder = "Describe the changes you want to make…",
  label = "What would you like to build?",
  className,
}: PromptInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      if (value.trim() && !loading) onSubmit();
    }
  };

  return (
    <div className={cn("rounded-xl border border-border bg-surface overflow-hidden", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface-elevated">
        <Sparkles className="h-4 w-4 text-accent" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={5}
          disabled={loading}
          className="w-full resize-none bg-transparent text-sm text-foreground placeholder:text-muted focus:outline-none disabled:opacity-50"
        />
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-muted">
            Press <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">⌘</kbd>+
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd> to submit
          </p>
          <Button onClick={onSubmit} loading={loading} disabled={!value.trim()}>
            <Send className="h-4 w-4" />
            Generate Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
