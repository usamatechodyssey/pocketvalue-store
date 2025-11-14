// /src/app/account/layout.tsx

import { auth } from "../auth";
import { redirect } from "next/navigation";
import AccountSidebar from "./_components/AccountSidebar";
import AccountSidebarClient from "./_components/AccountSidebarClient";
import Breadcrumbs from "@/app/components/ui/Breadcrumbs"; // <-- IMPORT Breadcrumbs
// import { getBreadcrumbs } from "@/sanity/lib/queries"; // <-- IMPORT getBreadcrumbs

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  // --- FETCH BREADCRUMBS DATA ---
  // Note: We create a simple static breadcrumb here as it's a static section
  const breadcrumbs = [
    { name: "Home", href: "/" },
    { name: "My Account", href: "/account" },
  ];

  return (
    <main className="w-full bg-gray-50 dark:bg-gray-900">
      <div className="max-w-screen-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* --- USE DYNAMIC BREADCRUMBS COMPONENT --- */}
        <div className="mb-6">
          <Breadcrumbs crumbs={breadcrumbs} />
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24">
              <AccountSidebar />
            </div>
          </aside>

          <main className="lg:col-span-9">
            <AccountSidebarClient>{children}</AccountSidebarClient>
          </main>
        </div>
      </div>
    </main>
  );
}

// --- SUMMARY OF CHANGES ---
// - Removed the old, manually coded `Link` and `ChevronRight` elements for breadcrumbs.
// - Imported the reusable `Breadcrumbs` component and `getBreadcrumbs` function.
// - Created a static `breadcrumbs` array directly within the layout, as this part of the site has a fixed hierarchy. This is more efficient than calling the server-side `getBreadcrumbs` function for a static path.
// - Rendered the `<Breadcrumbs crumbs={breadcrumbs} />` component, ensuring a consistent look, feel, and JSON-LD structure across the entire site, including the account section.
