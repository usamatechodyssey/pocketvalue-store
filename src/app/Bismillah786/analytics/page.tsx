// /app/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getAnalyticsData } from "./_actions/analyticsActions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Sector,
} from "recharts";
import { DollarSign, ShoppingCart, Users, BarChart2 } from "lucide-react";
import { ClipLoader } from "react-spinners";

// --- Type Definitions ---
interface SourceData {
  source: string;
  sales: number;
  orders: number;
}
interface AnalyticsData {
  salesBySource: SourceData[];
  overall: { totalSales: number; totalOrders: number };
  newUsers: number;
}

// --- Helper Components ---
const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
}) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center gap-4">
      <div className="bg-teal-100 p-3 rounded-full">
        <Icon className="text-teal-600" size={24} />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF42A2",
];

const renderActiveShape = (props: any) => {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;
  return (
    <g>
      <text
        x={cx}
        y={cy}
        dy={-10}
        textAnchor="middle"
        fill="#333"
        className="font-bold"
      >
        {payload.source}
      </text>
      <text
        x={cx}
        y={cy}
        dy={10}
        textAnchor="middle"
        fill="#666"
      >{`Rs. ${payload.sales.toLocaleString()}`}</text>
      <text
        x={cx}
        y={cy}
        dy={30}
        textAnchor="middle"
        fill="#999"
      >{`(Orders: ${payload.orders})`}</text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

// --- Main Page Component ---
export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const analyticsData = await getAnalyticsData(days);
      setData(analyticsData);
      setLoading(false);
    };
    fetchData();
  }, [days]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <ClipLoader color="#14b8a6" size={50} />
      </div>
    );
  }

  if (!data) return <p>Could not load analytics data.</p>;

  return (
    <div className="space-y-8">
      {/* Header & Filters */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Growth Analytics</h1>
        <div className="flex items-center gap-2">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-4 py-2 text-sm font-medium rounded-md ${days === d ? "bg-teal-600 text-white" : "bg-white border hover:bg-gray-100"}`}
            >
              Last {d} days
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Total Sales"
          value={`Rs. ${data.overall.totalSales.toLocaleString()}`}
          icon={DollarSign}
        />
        <StatCard
          title="Total Orders"
          value={data.overall.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          title="New Customers"
          value={data.newUsers.toLocaleString()}
          icon={Users}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Sales by Source Pie Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Sales by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                data={data.salesBySource}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="sales"
                onMouseEnter={(_, index) => setActiveIndex(index)}
              >
                {data.salesBySource.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Orders by Source Bar Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-bold text-lg mb-4">Orders by Source</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data.salesBySource}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="source"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #ccc",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "14px" }} />
              <Bar dataKey="orders" fill="#00C49F" name="Orders" />
              <Bar dataKey="sales" fill="#0088FE" name="Sales (Rs.)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-bold text-lg mb-4">Detailed Source Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left font-semibold">Source</th>
                <th className="p-3 text-right font-semibold">Orders</th>
                <th className="p-3 text-right font-semibold">Sales (Rs.)</th>
                <th className="p-3 text-right font-semibold">
                  Avg. Order Value
                </th>
              </tr>
            </thead>
            <tbody>
              {data.salesBySource.map((item) => (
                <tr key={item.source} className="border-b">
                  <td className="p-3 font-medium text-gray-800 capitalize">
                    {item.source}
                  </td>
                  <td className="p-3 text-right">
                    {item.orders.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    {item.sales.toLocaleString()}
                  </td>
                  <td className="p-3 text-right">
                    Rs. {Math.round(item.sales / item.orders).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
