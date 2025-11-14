// // /app/account/returns/[returnId]/page.tsx

// import { auth } from "@/app/auth";
// import { notFound, redirect } from "next/navigation";
// import Link from "next/link";
// import {
//   ArrowLeft,
//   FileText,
//   Package,
//   MessageSquare,
//   CheckCircle,
//   Clock,
// } from "lucide-react";
// import { getSingleUserReturnRequest } from "@/app/actions/returnActions"; // Hamara naya action
// import ReturnItemCard from "../_components/ReturnItemCard"; // Yeh component hum agle step mein banayenge

// // Reusable InfoCard Component
// const InfoCard = ({
//   icon,
//   title,
//   children,
// }: {
//   icon: React.ReactNode;
//   title: string;
//   children: React.ReactNode;
// }) => (
//   <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
//     <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
//       {icon}
//       {title}
//     </h2>
//     {children}
//   </div>
// );

// export default async function ReturnDetailPage({
//   params,
// }: {
//   params: { returnId: string };
// }) {
//   const session = await auth();
//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   const { returnId } = params;
//   const request = await getSingleUserReturnRequest(returnId);

//   if (!request) {
//     notFound();
//   }

//   return (
//     <div className="space-y-8">
//       {/* Page Header */}
//       <div>
//         <Link
//           href="/account/returns"
//           className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline mb-4"
//         >
//           <ArrowLeft size={16} /> Back to My Returns
//         </Link>
//         <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
//           Return Request Details
//         </h1>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           Request ID:{" "}
//           <span className="font-mono font-semibold">
//             #{request._id.slice(-6).toUpperCase()}
//           </span>
//           <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
//           <span>
//             {new Date(request.createdAt).toLocaleDateString("en-US", {
//               year: "numeric",
//               month: "long",
//               day: "numeric",
//             })}
//           </span>
//         </p>
//       </div>

//       {/* Request Summary Card */}
//       <InfoCard icon={<FileText size={20} />} title="Request Summary">
//         <div className="space-y-3 text-sm">
//           <div className="flex justify-between">
//             <span className="text-gray-500 dark:text-gray-400">Status:</span>
//             <span className="font-semibold text-gray-800 dark:text-gray-100">
//               {request.status}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-gray-500 dark:text-gray-400">
//               Original Order:
//             </span>
//             <Link
//               href={`/account/orders/${request.orderNumber}`}
//               className="font-semibold text-brand-primary hover:underline"
//             >
//               {request.orderNumber}
//             </Link>
//           </div>
//           {request.resolution && (
//             <div className="flex justify-between items-center">
//               <span className="text-gray-500 dark:text-gray-400">
//                 Resolution:
//               </span>
//               <span className="font-semibold text-green-600 flex items-center gap-1.5">
//                 <CheckCircle size={14} /> {request.resolution}
//               </span>
//             </div>
//           )}
//         </div>
//       </InfoCard>

//       {/* Items List Card */}
//       <InfoCard
//         icon={<Package size={20} />}
//         title={`Items to be Returned (${request.items.length})`}
//       >
//         <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700 -mt-4">
//           {request.items.map((item) => (
//             <ReturnItemCard key={item.variantKey} item={item} />
//           ))}
//         </div>
//       </InfoCard>

//       {/* Comments Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//         {request.customerComments && (
//           <InfoCard icon={<MessageSquare size={20} />} title="Your Comments">
//             <p className="text-sm text-gray-600 dark:text-gray-300 italic">
//               "{request.customerComments}"
//             </p>
//           </InfoCard>
//         )}
//         {request.adminComments && (
//           <InfoCard icon={<MessageSquare size={20} />} title="Admin Notes">
//             <p className="text-sm text-gray-600 dark:text-gray-300 italic">
//               "{request.adminComments}"
//             </p>
//           </InfoCard>
//         )}
//       </div>
//     </div>
//   );
// }

// // --- SUMMARY OF CHANGES ---
// // - **Naya Feature:** Ek naya, aala-mayari Server Component (`/app/account/returns/[returnId]/page.tsx`) banaya gaya hai.
// // - **Architectural Consistency (Rule #2 & #7):** Yeh page server par data fetch karne ke liye hamare naye `getSingleUserReturnRequest` action ka istemal karta hai.
// // - **Componentization (Rule #5):** Page ka structure `InfoCard` jaise reusable components par banaya gaya hai, aur items ki list dikhane ke liye ek alag `ReturnItemCard` component ka istemal kiya gaya hai.
// // - **User Experience:** User ko uski request ki tamam zaroori maloomat (status, resolution, comments) ek saaf suthre aur aasan tareeqe se faraham ki gayi hain.
import { auth } from "@/app/auth";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  Package,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { getSingleUserReturnRequest } from "@/app/actions/returnActions";
import ReturnItemCard from "../_components/ReturnItemCard";

// Reusable InfoCard Component
const InfoCard = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="p-6 bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm">
    <h2 className="font-bold text-lg mb-4 text-gray-800 dark:text-gray-200 flex items-center gap-3">
      {icon}
      {title}
    </h2>
    {children}
  </div>
);

// --- NEXT.JS 16+ COMPLIANCE FIX IS HERE ---
// Page props are now correctly typed and handled for async operations.
export default async function ReturnDetailPage({
  params,
}: {
  params: Promise<{ returnId: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Await the params promise before destructuring.
  const { returnId } = await params;
  const request = await getSingleUserReturnRequest(returnId);

  if (!request) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <Link
          href="/account/returns"
          className="flex items-center gap-2 text-sm font-semibold text-brand-primary hover:underline mb-4"
        >
          <ArrowLeft size={16} /> Back to My Returns
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-gray-100">
          Return Request Details
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Request ID:{" "}
          <span className="font-mono font-semibold">
            #{request._id.slice(-6).toUpperCase()}
          </span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">•</span>
          <span>
            {new Date(request.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      </div>

      {/* Request Summary Card */}
      <InfoCard icon={<FileText size={20} />} title="Request Summary">
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Status:</span>
            <span className="font-semibold text-gray-800 dark:text-gray-100">
              {request.status}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">
              Original Order:
            </span>
            <Link
              href={`/account/orders/${request.orderNumber}`}
              className="font-semibold text-brand-primary hover:underline"
            >
              {request.orderNumber}
            </Link>
          </div>
          {request.resolution && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 dark:text-gray-400">
                Resolution:
              </span>
              <span className="font-semibold text-green-600 flex items-center gap-1.5">
                <CheckCircle size={14} /> {request.resolution}
              </span>
            </div>
          )}
        </div>
      </InfoCard>

      {/* Items List Card */}
      <InfoCard
        icon={<Package size={20} />}
        title={`Items to be Returned (${request.items.length})`}
      >
        <div className="space-y-4 divide-y divide-gray-200 dark:divide-gray-700 -mt-4">
          {request.items.map((item) => (
            <ReturnItemCard key={item.variantKey} item={item} />
          ))}
        </div>
      </InfoCard>

      {/* Comments Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {request.customerComments && (
          <InfoCard icon={<MessageSquare size={20} />} title="Your Comments">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              "{request.customerComments}"
            </p>
          </InfoCard>
        )}
        {request.adminComments && (
          <InfoCard icon={<MessageSquare size={20} />} title="Admin Notes">
            <p className="text-sm text-gray-600 dark:text-gray-300 italic">
              "{request.adminComments}"
            </p>
          </InfoCard>
        )}
      </div>
    </div>
  );
}
