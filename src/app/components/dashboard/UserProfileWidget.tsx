import Image from "next/image";
import Link from "next/link";
import { User as UserIcon, Edit } from "lucide-react";

interface UserProfileWidgetProps {
  name: string;
  email: string;
  imageUrl?: string | null;
  role?: string;
  editProfileHref: string;
}

export default function UserProfileWidget({
  name,
  email,
  imageUrl,
  role,
  editProfileHref,
}: UserProfileWidgetProps) {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full">
              <UserIcon className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">
            {name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {email}
          </p>
          {role && (
            <span className="mt-2 inline-block px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 rounded-md">
              {role}
            </span>
          )}
        </div>
      </div>
      <Link
        href={editProfileHref}
        className="mt-4 flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <Edit size={14} />
        Edit Profile
      </Link>
    </div>
  );
}