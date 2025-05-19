import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import connectToDB from '@/lib/mongodb';
import tripModel from '@/models/tripModel';
import jwt from 'jsonwebtoken';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    await connectToDB();
    const token = request.headers.get('authorization').split(' ')[1];
    const userData = jwt.verify(token, process.env.JWT_TOKEN);
    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Only Admins allowed' }, { status: 500 });
    }
    const formData = await request.formData();

    // Get fields
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');
    const duration = formData.get('duration');
    const video = formData.get('video');

    // Get all images (can be multiple)
    const images = formData.getAll('images');
    if (!name || !price || !description || !images) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Helper to upload buffer to Cloudinary
    const uploadBufferToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });
        stream.end(buffer);
      });
    };

    const imageUrls = [];
    for (const img of images) {
      const arrayBuffer = await img.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const url = await uploadBufferToCloudinary(buffer);
      imageUrls.push(url);
    }

    // Video upload (if present)
    let videoUrl = null;
    if (video && video.size > 0) {
      const arrayBuffer = await video.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      videoUrl = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'video' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });
        stream.end(buffer);
      });
    }

    await tripModel.create({ name, price, description, duration, images: imageUrls, video: videoUrl });

    return NextResponse.json(
      { message: 'Trip uploaded successfully', images: imageUrls, video: videoUrl },
      { status: 201 }
    );
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ message: 'Failed to upload trip' }, { status: 500 });
  }
}