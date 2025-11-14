import Link from "next/link";
import { LucideProps } from "lucide-react";

interface Action {
  label: string;
  href: string;
  icon: React.ComponentType<LucideProps>;
}

interface QuickActionsWidgetProps {
  title: string;
  actions: Action[];
}

export default function QuickActionsWidget({
  title,
  actions,
}: QuickActionsWidgetProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex flex-col items-center text-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:bg-brand-primary/10 transition-colors">
              <Icon
                className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-brand-primary transition-colors"
                strokeWidth={1.5}
              />
            </div>
            <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
              {label}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
