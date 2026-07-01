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
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-500">
            {title}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-neutral-900">
            {value}
          </h2>
        </div>

        {icon}
      </div>

      <p className="mt-4 text-sm text-neutral-500">
        {description}
      </p>
    </div>
  );
}