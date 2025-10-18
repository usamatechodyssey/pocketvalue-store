import React from "react";
import ProfileForm from "./_components/ProfileForm";
import { User } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <User size={28} className="text-gray-700 dark:text-gray-200" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          My Profile
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-400">
        Manage your personal information, change your password, and update your profile picture.
      </p>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
        <ProfileForm />
      </div>
    </div>
  );
}