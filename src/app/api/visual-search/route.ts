// src/app/api/visual-search/route.ts

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const apiUrl = process.env.VISUAL_SEARCH_API_URL;
    const apiKey = process.env.VISUAL_SEARCH_API_KEY;

    if (!apiUrl || !apiKey) {
      return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    // 🚀 Server-to-Server Call (Secure)
    const externalResponse = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "x-api-key": apiKey, // Key yahan server side pe lag rahi hai (Safe)
      },
      body: formData,
    });

    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      return NextResponse.json(
        { error: "AI Service Error", details: errorText },
        { status: externalResponse.status }
      );
    }

    const data = await externalResponse.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error("Proxy Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}