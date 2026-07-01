import { ReactNode } from "react";

type DashboardCardProps = {
  title: string;
  value: string | number;
  description: string;
  icon?: ReactNode;
};

export default function DashboardCard({
  title,
  value,
  description,
  icon,
}: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-border bg-surface p-6 transition duration-200 hover:border-neutral-500">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
            {value}
          </h2>
        </div>

        {icon && <div className="text-neutral-400">{icon}</div>}
      </div>

      <p className="mt-4 text-sm text-neutral-400">
        {description}
      </p>
    </div>
  );
}