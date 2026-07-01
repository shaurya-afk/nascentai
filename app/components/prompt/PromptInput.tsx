"use client";

import { Send, Terminal } from "lucide-react";
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
  placeholder = "Describe the changes you want to make in this codebase...",
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
    <div className={cn("rounded-lg border border-border bg-surface p-6 shadow-xl animate-fade-in", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Terminal className="h-4.5 w-4.5 text-neutral-400" />
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest">{label}</span>
      </div>
      <div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={6}
          disabled={loading}
          className="w-full resize-none rounded-lg border border-border bg-black p-4 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500 transition-colors disabled:opacity-50 leading-relaxed font-sans"
        />
        <div className="mt-4 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-xs text-neutral-500 font-medium">
            Press <kbd className="rounded border border-border bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">⌘</kbd>+
            <kbd className="rounded border border-border bg-neutral-900 px-1.5 py-0.5 font-mono text-[10px] text-neutral-400">Enter</kbd> to submit request
          </p>
          <Button onClick={onSubmit} loading={loading} disabled={!value.trim()} variant="primary" className="py-2.5 px-5">
            <Send className="h-3.5 w-3.5 mr-1.5" />
            Generate Plan
          </Button>
        </div>
      </div>
    </div>
  );
}
