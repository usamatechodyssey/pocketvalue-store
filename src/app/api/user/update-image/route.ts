import { NextResponse } from 'next/server';
import { auth } from '@/app/auth';
import { v2 as cloudinary } from 'cloudinary';
import clientPromise from '@/app/lib/mongodb';
import { ObjectId } from 'mongodb';
import { Readable } from 'stream';

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const DB_NAME = process.env.MONGODB_DB_NAME!;
// Convert Blob to Buffer
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
    const file = formData.get('image') as File;

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
            reject(err);
          }
          resolve(result);
        }
      );
      Readable.from(buffer).pipe(stream);
    });

    console.log('✅ Cloudinary Upload Result:', uploadResult);

    const imageUrl = uploadResult.secure_url;

    const client = await clientPromise;
    const db = client.db(DB_NAME);

    console.log('🧩 Updating user with ID:', session.user.id);

    const updateResult = await db.collection('users').updateOne(
      { _id: new ObjectId(session.user.id) },
      { $set: { image: imageUrl } }
    );

    console.log('🛠️ MongoDB Update Result:', updateResult);

    if (updateResult.modifiedCount === 0) {
      return NextResponse.json({ success: false, message: 'Failed to update image in DB' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully!',
      imageUrl,
    });
  } catch (error) {
    console.error('❌ Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 });
  }
};
