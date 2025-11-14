import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Helper Function for Status Colors
const getStatusClasses = (status?: string) => {
  switch (status) {
    case "Pending": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    case "Processing": return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "Shipped": return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300";
    case "Delivered": return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    case "Cancelled": return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
    default: return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

interface ActivityItem {
  id: string;
  primaryText: string;
  secondaryText: string;
  status?: string;
  href: string;
}

interface RecentActivityWidgetProps {
  title: string;
  items: ActivityItem[];
  viewAllHref: string;
  emptyStateMessage: string;
}

export default function RecentActivityWidget({
  title,
  items,
  viewAllHref,
  emptyStateMessage,
}: RecentActivityWidgetProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold text-brand-primary hover:underline flex items-center gap-1"
        >
          View All <ArrowRight size={14} />
        </Link>
      </div>
      {items.length > 0 ? (
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex items-center justify-between p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <div>
                  <p className="font-semibold text-sm text-gray-800 dark:text-gray-200">
                    {item.primaryText}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.secondaryText}
                  </p>
                </div>
                {item.status && (
                   <span
                    className={`px-2 py-0.5 text-xs font-semibold rounded-full ${getStatusClasses(item.status)}`}
                  >
                    {item.status}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
          <p>{emptyStateMessage}</p>
        </div>
      )}
    </div>
  );
}