import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbLink {
  name: string;
  href: string;
}

interface Props {
  links: BreadcrumbLink[];
}

export default function Breadcrumbs({ links }: Props) {
  // Agar koi link na ho to component ko render na karein
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="text-xs sm:text-sm text-text-secondary dark:text-gray-400">
      <ol className="flex items-center space-x-1.5 sm:space-x-2">
        {links.map((link, index) => (
          <li key={link.name} className="flex items-center">
            {/* Pehle link ke ilawa sab ke shuru mein separator dikhayein */}
            {index > 0 && (
              <ChevronRight size={14} className="mr-1.5 sm:mr-2 flex-shrink-0 text-gray-400 dark:text-gray-500" />
            )}
            
            {/* Aakhri link ko link na banayein, sirf text dikhayein */}
            {index === links.length - 1 ? (
              <span className="font-semibold text-text-primary dark:text-gray-200" aria-current="page">
                {link.name}
              </span>
            ) : (
              <Link
                href={link.href}
                className="hover:text-brand-primary hover:underline transition-colors"
              >
                {link.name}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}