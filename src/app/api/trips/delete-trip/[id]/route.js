import { NextResponse } from 'next/server';
import tripModel from '@/models/tripModel';
import connectToDB from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function DELETE(req, { params }) {
  try {
    await connectToDB();
    const token = req.headers.get('authorization').split(' ')[1];
    const userData = jwt.verify(token, process.env.JWT_TOKEN);
    if (userData.role !== 'admin') {
      return NextResponse.json({ error: 'Only Admins allowed' }, { status: 500 });
    }
    const { id } =await params;
    const trip = await tripModel.findById(id);
    if (!trip) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    // Delete images
    if (trip.images && trip.images.length > 0) {
      for (const imageUrl of trip.images) {
        const publicId = imageUrl.split('/').pop().split('.')[0];
        if (publicId) {
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    // Delete video
    if (trip.video) {
      const videoPublicId = trip.video.split('/').pop().split('.')[0];
      if (videoPublicId) {
        await cloudinary.uploader.destroy(videoPublicId, { resource_type: 'video' });
      }
    }

    // Delete trip
    await tripModel.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Trip deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Failed to delete trip:', error);
    return NextResponse.json({ message: 'Failed to delete trip' }, { status: 500 });
  }
}
