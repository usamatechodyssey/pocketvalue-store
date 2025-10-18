"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "react-hot-toast";
import { updateProfile, updatePassword } from "../_actions/profileActions";
import Image from "next/image";
import { User as UserIcon, Upload, Loader2, Image as ImageIcon, KeyRound, Save } from "lucide-react";

export default function ProfileForm() {
  const { data: session, status, update: updateSession } = useSession();

  const [name, setName] = useState("");
  const [passwords, setPasswords] = useState({ currentPassword_1: "", newPassword_1: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isProfileLoading, startProfileTransition] = useTransition();
  const [isPasswordLoading, startPasswordTransition] = useTransition();
  const [isUploading, startUploadingTransition] = useTransition();

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session?.user?.name]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        toast.error("Image must be less than 2MB.");
        return;
      }
      setImageFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = () => {
    if (!imageFile) return;
    startUploadingTransition(async () => {
      const formData = new FormData();
      formData.append("image", imageFile);
      try {
        const response = await fetch("/api/user/update-image", { method: "POST", body: formData });
        const result = await response.json();
        if (result.success) {
          await updateSession({ trigger: "update" });
          toast.success("Profile image updated.");
          setImageFile(null); setPreviewUrl(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        } else { toast.error(result.message); }
      } catch (error) { toast.error("An error occurred during upload."); }
    });
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !name.trim() || name === session.user?.name) {
      toast.error("Please enter a new name.");
      return;
    }
    startProfileTransition(async () => {
      const result = await updateProfile({ name });
      if (result.success) {
        toast.success(result.message);
        await signOut({ callbackUrl: "/login" });
      } else { toast.error(result.message); }
    });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword_1.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }
    if (passwords.newPassword_1 === passwords.currentPassword_1) {
      toast.error("New password cannot be the same as the current password.");
      return;
    }
    startPasswordTransition(async () => {
      const result = await updatePassword(passwords);
      if (result.success) {
        toast.success(result.message);
        await signOut({ callbackUrl: "/login" });
      } else { toast.error(result.message); }
    });
  };

  const anyLoading = isProfileLoading || isPasswordLoading || isUploading;

  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-64"><Loader2 className="animate-spin text-brand-primary" size={40} /></div>
    );
  }

  if (!session || !session.user) {
    return <p className="text-center text-gray-500">Please log in to view your profile.</p>;
  }

  const imageSrc = previewUrl || session.user.image || null;

  return (
    <div className="space-y-8">
      {/* Profile Picture Section */}
      <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <ImageIcon size={20} /> Profile Picture
        </h2>
        <div className="flex items-center gap-6">
          <div className="relative h-24 w-24 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600">
            {imageSrc ? <Image src={imageSrc} alt="Profile" fill className="object-cover" /> : <div className="flex items-center justify-center h-full w-full"><UserIcon className="h-10 w-10 text-gray-400" /></div>}
          </div>
          <div className="flex flex-col gap-2">
            <input type="file" accept="image/png, image/jpeg" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button onClick={() => fileInputRef.current?.click()} disabled={anyLoading} className="px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors">
              Choose Image
            </button>
            {imageFile && (
              <button onClick={handleImageUpload} disabled={isUploading} className="px-4 py-2 bg-brand-primary text-on-primary rounded-lg text-sm font-bold hover:bg-brand-primary-hover disabled:opacity-70 flex items-center justify-center gap-2">
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
                {isUploading ? "Uploading..." : "Upload & Save"}
              </button>
            )}
          </div>
        </div>
        {imageFile && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Selected: {imageFile.name}</p>}
      </div>

      {/* Personal Info Form */}
      <form onSubmit={handleProfileSubmit} className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <UserIcon size={20} /> Personal Information
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input id="fullName" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input id="email" type="email" value={session.user.email || ""} disabled readOnly className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"/>
          </div>
          <button type="submit" disabled={isProfileLoading || anyLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-on-primary rounded-lg text-sm font-bold hover:bg-brand-primary-hover disabled:bg-opacity-50 transition-colors">
            {isProfileLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isProfileLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>

      {/* Change Password Form */}
      <form onSubmit={handlePasswordSubmit} className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
            <KeyRound size={20} /> Change Password
        </h2>
        <div className="space-y-4 max-w-md">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
            <input id="currentPassword" type="password" value={passwords.currentPassword_1} onChange={(e) => setPasswords((p) => ({ ...p, currentPassword_1: e.target.value }))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary" />
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
            <input id="newPassword" type="password" value={passwords.newPassword_1} onChange={(e) => setPasswords((p) => ({ ...p, newPassword_1: e.target.value }))} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 shadow-sm focus:border-brand-primary focus:ring-brand-primary" />
          </div>
          <button type="submit" disabled={isPasswordLoading || anyLoading} className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-on-primary rounded-lg text-sm font-bold hover:bg-brand-primary-hover disabled:bg-opacity-50 transition-colors">
            {isPasswordLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
            {isPasswordLoading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </form>
    </div>
  );
}