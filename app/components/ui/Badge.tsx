import { cn } from "@/app/lib/utils";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "info" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface text-neutral-200 border-border",
  success: "bg-white text-black border-white font-medium",
  danger: "bg-transparent text-neutral-400 border-border border-dashed",
  warning: "bg-neutral-900 text-neutral-300 border-border",
  info: "bg-neutral-900 text-neutral-200 border-border",
  muted: "bg-transparent text-muted border-border",
};

export default function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
