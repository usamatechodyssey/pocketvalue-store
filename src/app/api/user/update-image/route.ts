
// /src/app/api/user/update-image/route.ts

import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// --- NAYE IMPORTS ---
import connectMongoose from '@/app/lib/mongoose';
import User from '@/models/User'; // Hamara naya, mustanad User model

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Helper function to convert Blob to Buffer
const blobToBuffer = async (blob: Blob): Promise<Buffer> => {
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
};

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, message: 'Not Authenticated' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
    }

    const buffer = await blobToBuffer(file);

    // Upload buffer to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'pocketvalue_profiles' },
        (err, result) => {
          if (err) {
            console.error('Cloudinary Error:', err);
            return reject(err);
          }
          resolve(result);
        }
      );
      Readable.from(buffer).pipe(stream);
    });

    const imageUrl = uploadResult.secure_url;
    if (!imageUrl) {
        throw new Error("Image URL not returned from Cloudinary.");
    }

    // --- YAHAN BEHTARI KI GAYI HAI ---
    
    // 1. Mongoose se connect karein
    await connectMongoose();

    // 2. Mongoose ke zariye user dhoondein
    const user = await User.findById(session.user.id);
    if (!user) {
        return NextResponse.json({ success: false, message: 'User not found in database' }, { status: 404 });
    }

    // 3. User ki image update karein aur save karein
    user.image = imageUrl;
    await user.save();
    
    console.log(`✅ Image updated for user: ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully!',
      imageUrl,
    });

  } catch (error) {
    console.error('❌ Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed due to a server error.' }, { status: 500 });
  }
};

// --- SUMMARY OF CHANGES ---
// - **Architectural Consistency (Rule #5):** `mongodb` native driver ka istemal mukammal taur par Mongoose `User` model se replace kar diya gaya hai. `updateOne` aur `new ObjectId()` jaisi commands ke bajaye ab Mongoose ka simple `User.findById`, `user.image = ...`, aur `user.save()` ka tareeqa istemal ho raha hai.
// - **Code Readability & Simplicity:** Data update karne ka logic ab bohot saaf suthra, parhne mein aasan, aur ghaltiyon se paak hai.
// - **Robust Error Handling:** Agar Cloudinary se image URL wapas na aaye to us soorat mein error ko behtar tareeqe se handle kiya gaya hai.