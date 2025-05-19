// app/api/trips/route.js
import { NextResponse } from 'next/server';
import connectToDB from '@/lib/mongodb';
import Trip from '@/models/tripModel';
import cloudinary from 'cloudinary';


// Disable Next.js default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    await connectToDB();
    const trips = await Trip.find().sort({ createdAt: -1 });
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch trips', error: error.message },
      { status: 500 }
    );
  }
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({ keepExtensions: true, multiples: true });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

// POST: Upload trip with images & video
export async function POST(req) {
  try {
    await connectToDB();

    const { fields, files } = await parseForm(req);

    const { name, price, description, duration } = fields;
    const images = files.images;
    const video = files.video;

    if (!name || !price || !description || !images) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    let imageUrls = [];
    let videoUrl = '';

    const uploadImage = async (file) => {
      const result = await cloudinary.v2.uploader.upload(file.filepath);
      return result.secure_url;
    };

    // Upload images
    if (Array.isArray(images)) {
      for (const img of images) {
        const url = await uploadImage(img);
        imageUrls.push(url);
      }
    } else {
      const url = await uploadImage(images);
      imageUrls.push(url);
    }

    // Upload video if present
    if (video) {
      const videoResult = await cloudinary.v2.uploader.upload(video.filepath, {
        resource_type: 'video',
      });
      videoUrl = videoResult.secure_url;
    }

    // Save to DB
    await Trip.create({
      name,
      price,
      description,
      duration,
      images: imageUrls,
      video: videoUrl,
    });

    return NextResponse.json({ message: 'Trip uploaded successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to upload trip' }, { status: 500 });
  }
}

