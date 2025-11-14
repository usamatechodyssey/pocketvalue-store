// /app/api/upload-image/route.ts
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from 'next/server';

// POST request ko handle karne ka function
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    // Sanity mein asset upload karein
    const imageAsset = await client.assets.upload('image', file, {
      contentType: file.type,
      filename: file.name,
    });

    // Success response mein uploaded asset ki details bhejein
    return NextResponse.json({ asset: imageAsset }, { status: 201 });

  } catch (error) {
    console.error('Image upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed.' }, { status: 500 });
  }
}