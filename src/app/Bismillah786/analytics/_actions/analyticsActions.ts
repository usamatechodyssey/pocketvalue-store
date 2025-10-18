// /app/admin/analytics/_actions/analyticsActions.ts
"use server";

import clientPromise from "@/app/lib/mongodb";
import { startOfDay, subDays } from 'date-fns';
import { ObjectId } from 'mongodb'; // ObjectId ko import karein

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

const DB_NAME = process.env.MONGODB_DB_NAME!;
export async function getAnalyticsData(days: number = 30): Promise<AnalyticsData> {
  try {
    const client = await clientPromise;
    const db = client.db(DB_NAME);
    
    const endDate = new Date();
    const startDate = startOfDay(subDays(endDate, days));

    // --- Sales aur Orders ka logic bilkul perfect hai, koi change nahi ---
    const pipeline = [
      { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
      { $group: { _id: "$trafficSource.source", totalSales: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } },
      { $project: { _id: 0, source: "$_id", sales: "$totalSales", orders: "$totalOrders" } },
      { $sort: { sales: -1 } }
    ];
    const salesBySource = await db.collection("orders").aggregate(pipeline).toArray() as SourceData[];
    
    const overallStatsPipeline = [
        { $match: { orderDate: { $gte: startDate, $lte: endDate } } },
        { $group: { _id: null, totalSales: { $sum: "$totalPrice" }, totalOrders: { $sum: 1 } } }
    ];
    const overallStatsData = await db.collection("orders").aggregate(overallStatsPipeline).toArray();
    const overall = {
      totalSales: overallStatsData[0]?.totalSales || 0,
      totalOrders: overallStatsData[0]?.totalOrders || 0,
    };

    // === THE FIX IS HERE: NEW USERS LOGIC ===
    // Hum `_id` se timestamp nikal kar usay filter karenge
    const startTimestamp = Math.floor(startDate.getTime() / 1000).toString(16) + "0000000000000000";
    const startObjectId = new ObjectId(startTimestamp);

    const totalUsers = await db.collection("users").countDocuments({
        _id: { $gte: startObjectId }
    });

    return {
      salesBySource,
      overall,
      newUsers: totalUsers,
    };

  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    return { salesBySource: [], overall: { totalSales: 0, totalOrders: 0 }, newUsers: 0 };
  }
}