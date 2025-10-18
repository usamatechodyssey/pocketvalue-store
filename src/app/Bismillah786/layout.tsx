// src/app/admin/(dashboard)/layout.tsx - SIRF STYLING UPDATE

import AdminSidebar from "./_components/AdminSidebar";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // === YAHAN CLASSES UPDATE HUIN HAIN ===
    <div className="flex min-h-screen bg-surface-ground">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
