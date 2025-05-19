import connectToDB from "@/lib/mongodb";
import { NextResponse } from 'next/server';
import tripModel from "@/models/tripModel";
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function PUT(req, { params }) {
  try {
    await connectToDB();
    const token = req.headers.get('authorization').split(' ')[1];
    const userData=jwt.verify(token, process.env.JWT_TOKEN);
    if (userData.role!=='admin') {
      return NextResponse.json({ error: 'Only Admins allowed' }, { status: 500 });
    }
    const { id } =await params;
    const formData = await req.formData();

    const trip = await tripModel.findById(id);
    if (!trip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 });
    }

    // Get fields
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');
    const duration = formData.get('duration');
    const video = formData.get('video');
    const delVideo = formData.get('delVideo');
    const deleteImages = formData.get('deleteImages');
    const newImages = formData.getAll('newImages');

    // Parse deleteImages (may be JSON string or comma-separated)
    let delImageArray = [];
    if (deleteImages) {
      try {
        delImageArray = JSON.parse(deleteImages);
      } catch {
        delImageArray = typeof deleteImages === 'string' ? deleteImages.split(',') : [];
      }
    }

    // Update basic fields if provided
    if (name) trip.name = name;
    if (price) trip.price = price;
    if (duration) trip.duration = duration;
    if (description) trip.description = description;

    // --- Handle Video Deletion ---
    if (delVideo === 'true' && trip.video) {
      try {
        const publicId = trip.video.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        trip.video = null;
      } catch (err) {
        console.warn('Failed to delete video:', err.message);
      }
    }

    // --- Handle Video Upload ---
    if (video && video.size > 0) {
      // Delete old video if exists
      if (trip.video && delVideo !== 'true') {
        try {
          const publicId = trip.video.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
        } catch (err) {
          console.warn('Failed to delete old video:', err.message);
        }
      }
      // Upload new video
      try {
        const arrayBuffer = await video.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        trip.video = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream({ resource_type: 'video' }, (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          });
          stream.end(buffer);
        });
      } catch (err) {
        return NextResponse.json({ error: 'Failed to upload new video' }, { status: 500 });
      }
    }

    // --- Handle Image Deletion ---
    if (delImageArray.length > 0 && trip.images && trip.images.length > 0) {
      for (const url of delImageArray) {
        try {
          const publicId = url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.warn(`Failed to delete image: ${url}`, err.message);
        }
      }
      trip.images = trip.images.filter((img) => !delImageArray.includes(img));
    }

    // --- Handle New Image Uploads ---
    const uploadBufferToCloudinary = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        });
        stream.end(buffer);
      });
    };

    if (newImages && newImages.length > 0 && newImages[0].size > 0) {
      const imagesToUpload = Array.isArray(newImages) ? newImages : [newImages];
      for (const img of imagesToUpload) {
        if (img && img.size > 0) {
          const arrayBuffer = await img.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const url = await uploadBufferToCloudinary(buffer);
          trip.images.push(url);
        }
      }
    }

    // Save updated trip
    await trip.save();

    return NextResponse.json({ message: 'Trip updated successfully', trip }, { status: 200 });
  } catch (error) {
    console.error('Update Trip Error:', error.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}