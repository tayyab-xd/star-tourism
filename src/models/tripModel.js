import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    duration: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    video: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent model overwrite error in development
export default mongoose.models.Trip || mongoose.model('Trip', tripSchema);
