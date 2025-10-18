// /app/admin/page.tsx - SIRF STYLING UPDATE (Logic aapka hi hai)

import {
  getDashboardStats,
  getOrderStatusSummary,
} from "./_actions/dashboardActions";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Users,
  CreditCard,
  Clock,
  Truck,
  CheckCircle,
  XCircle,
} from "lucide-react";

// === StatCard Component (Updated) ===
function StatCard({
  title,
  value,
  icon: Icon,
  href,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  href?: string;
}) {
  const content = (
    <div className="bg-surface-base p-6 rounded-lg shadow-sm border border-surface-border flex items-center gap-4 hover:border-brand-primary transition-colors">
      <div className="bg-surface-ground p-3 rounded-full">
        <Icon className="text-text-secondary" size={24} />
      </div>
      <div>
        <p className="text-sm text-text-secondary">{title}</p>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

// === AdminDashboardPage (Updated) ===
export default async function AdminDashboardPage() {
  const [stats, orderSummary] = await Promise.all([
    getDashboardStats(),
    getOrderStatusSummary(),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-text-primary">
          Admin Dashboard
        </h1>
        <p className="text-text-secondary mt-2">
          Welcome to your Command Center!
        </p>
      </div>

      {/* Financial Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`Rs. ${stats.totalSales.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Sales (This Month)"
          value={`Rs. ${stats.monthSales.toLocaleString()}`}
          icon={CreditCard}
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="Total Customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
        />
      </div>

      {/* Operational Stats Section */}
      <div className="border-t border-surface-border pt-8">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Order Fulfillment Status
        </h2>
        <p className="text-sm text-text-subtle mb-4">
          Click on any status to see the filtered list of orders.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <StatCard
            title="Pending"
            value={orderSummary.Pending || 0}
            icon={Clock}
            href="/Bismillah786/orders?status=Pending" // Aapka original path
          />
          <StatCard
            title="Processing"
            value={orderSummary.Processing || 0}
            icon={Clock}
            href="/Bismillah786/orders?status=Processing" // Aapka original path
          />
          <StatCard
            title="Shipped"
            value={orderSummary.Shipped || 0}
            icon={Truck}
            href="/Bismillah786/orders?status=Shipped" // Aapka original path
          />
          <StatCard
            title="Delivered"
            value={orderSummary.Delivered || 0}
            icon={CheckCircle}
            href="/Bismillah786/orders?status=Delivered" // Aapka original path
          />
          <StatCard
            title="Cancelled"
            value={orderSummary.Cancelled || 0}
            icon={XCircle}
            href="/Bismillah786/orders?status=Cancelled" // Aapka original path
          />
        </div>
      </div>
    </div>
  );
}
