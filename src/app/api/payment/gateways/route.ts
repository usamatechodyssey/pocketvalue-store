// /src/app/api/payment/gateways/route.ts

import { getEnabledGateways } from "@/app/lib/payment/paymentAdapter";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const gateways = await getEnabledGateways();
        return NextResponse.json(gateways);
    } catch (error: any) {
        console.error("Failed to fetch payment gateways:", error);
        return NextResponse.json({ message: "Could not load payment options." }, { status: 500 });
    }
}