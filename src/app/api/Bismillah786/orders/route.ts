// /app/api/admin/orders/route.ts
import clientPromise from "@/app/lib/mongodb";
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME!;
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    let searchTerm = searchParams.get('search'); // Use 'let' to modify it
    
    const client = await clientPromise;
    const db = client.db(DB_NAME);

    const matchStage: any = {};
    if (status && status !== 'All') {
      matchStage.status = status;
    }
    
    if (searchTerm) {
      // === THE FINAL FIX IS HERE ===
      // Agar search term '#' se shuru hota hai, to usay hata do
      if (searchTerm.startsWith('#')) {
        searchTerm = searchTerm.substring(1);
      }

      const searchConditions: any[] = [
        { 'shippingAddress.fullName': { $regex: searchTerm, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: searchTerm, $options: 'i' } },
        // NAYA: ID ko string mein convert karke us par bhi search karein
        // Is se aap ID ka koi bhi hissa (shuru, aakhir, darmiyan) search kar sakenge
        { '_id': { $in: (await db.collection("orders").find({ $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: searchTerm, options: "i" } } }).project({_id:1}).toArray()).map(d => d._id) } },
      ];
      
      // Agar poori valid ID di hai, to usay bhi check karo
      if (ObjectId.isValid(searchTerm)) {
        searchConditions.push({ _id: new ObjectId(searchTerm) });
      }
      
      matchStage.$or = searchConditions;
    }
    
    const orders = await db.collection("orders").aggregate([
        { $match: matchStage },
        { $sort: { orderDate: -1 } },
        {
          $lookup: {
            from: "users",
            let: { userIdAsString: "$userId" },
            pipeline: [
              { $match: { $expr: { $eq: [{ $toString: "$_id" }, "$$userIdAsString"] } } },
            ],
            as: "userDetails",
          },
        },
        { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
        {
          $project: {
            _id: { $toString: "$_id" },
            totalPrice: 1,
            status: 1,
            orderDate: 1,
            customerName: { $ifNull: ["$userDetails.name", "Guest User"] },
            itemCount: { $size: "$products" },
          },
        },
    ]).toArray();
    
    return NextResponse.json({ orders });

  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    return NextResponse.json({ message: "Failed to fetch orders" }, { status: 500 });
  }
}