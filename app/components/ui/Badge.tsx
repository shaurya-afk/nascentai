import { cn } from "@/app/lib/utils";

type BadgeVariant = "default" | "success" | "danger" | "warning" | "info" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-surface-elevated text-foreground border-border",
  success: "bg-success-bg text-success border-success/30",
  danger: "bg-danger-bg text-danger border-danger/30",
  warning: "bg-warning/10 text-warning border-warning/30",
  info: "bg-accent/10 text-accent border-accent/30",
  muted: "bg-border-muted text-muted border-border",
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
