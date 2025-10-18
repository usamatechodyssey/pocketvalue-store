// /app/admin/_actions/dashboardActions.ts
"use server";

import clientPromise from "@/app/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME!;
// === ACTION #1: GET MAIN DASHBOARD STATS ===
export async function getDashboardStats() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const ordersCollection = db.collection("orders");

    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const statsPipeline = [
      { $match: { status: { $ne: "Cancelled" } } },
      { $facet: {
          totalSales: [{ $group: { _id: null, total: { $sum: "$totalPrice" } } }],
          monthSales: [
            { $match: { orderDate: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
          ]
      }}
    ];
    
    const statsData = await ordersCollection.aggregate(statsPipeline).toArray();
    const totalSales = statsData[0]?.totalSales[0]?.total || 0;
    const monthSales = statsData[0]?.monthSales[0]?.total || 0;

    const totalOrders = await ordersCollection.countDocuments();
    const totalCustomers = await db.collection("users").countDocuments();

    return { totalSales, monthSales, totalOrders, totalCustomers };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return { totalSales: 0, monthSales: 0, totalOrders: 0, totalCustomers: 0 };
  }
}

// === NAYA ACTION #2: GET ORDER STATUS SUMMARY ===
export async function getOrderStatusSummary() {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    const pipeline = [
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ];
    const results = await db.collection("orders").aggregate(pipeline).toArray();
    
    // Results ko aek aasan object mein convert karein
    const summary = results.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {} as { [key: string]: number });

    return summary;
  } catch (error) {
    console.error("Error fetching order status summary:", error);
    return {};
  }
}