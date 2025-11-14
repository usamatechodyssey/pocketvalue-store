import React from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}

export default function DashboardHeader({
  title,
  subtitle,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}