import Button from "./Button";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-surface px-8 py-16 text-center animate-fade-in max-w-xl mx-auto w-full my-8">
      <div className="mb-6 flex items-center justify-center text-white">
        {icon ?? (
          <img
            src="/lotus.svg"
            alt="Lotus"
            className="h-16 w-16 opacity-80"
          />
        )}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-white mb-2">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-neutral-400 leading-relaxed mb-6">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
