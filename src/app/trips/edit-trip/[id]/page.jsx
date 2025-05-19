'use client'
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AppContext } from '@/app/context/context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';

const EditTrip = () => {
  const context = useContext(AppContext);
  const params = useParams();
  const router = useRouter();
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [trip, setTrip] = useState(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    delVideo: false,
    deleteImages: [],
  });
  const [newImages, setNewImages] = useState([]);
  const [video, setVideo] = useState(null);
  const token=JSON.parse(localStorage.getItem('startourism'))
  useEffect(() => {
    const data = context?.state?.allTrips?.find((item) => item._id == id);
    if (data) {
      setForm({
        name: data.name,
        price: data.price,
        duration: data.duration,
        description: data.description,
        deleteImages: [],
      });
      setTrip(data);
    }
  }, [id, context?.state?.allTrips]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('duration', form.duration);
    formData.append('description', form.description);
    formData.append('delVideo', form.delVideo);
    formData.append('deleteImages', JSON.stringify(form.deleteImages));
    Array.from(newImages).forEach((img) => formData.append('newImages', img));
    if (video) formData.append('video', video);

    try {
      await axios.put(
      `/api/trips/update-trip/${id}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      }
    );
      toast.success('Trip updated successfully!');
      setLoading(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update trip. Please try again.');
      setLoading(false);
    }
  };

  const handleImageDelete = (imgUrl) => {
    if (form.deleteImages.includes(imgUrl)) {
      setForm({ ...form, deleteImages: form.deleteImages.filter((item) => item !== imgUrl) });
    } else {
      setForm({ ...form, deleteImages: [...form.deleteImages, imgUrl] });
    }
  };

  return (
    <div className="edit-trip-container max-w-4xl mx-auto p-6 rounded-lg shadow-lg bg-gray-100 dark:bg-gray-900 transition-all duration-300">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
        Edit Trip
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Trip name"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Price</label>
          <input
            type="text"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Price"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Duration</label>
          <input
            type="text"
            value={form.duration}
            onChange={(e) => setForm({ ...form, duration: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Duration"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Description"
          ></textarea>
        </div>

        {/* Current Images */}
        {trip?.images && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
              Current Images
            </label>
            <div className="flex flex-wrap gap-4">
              {trip.images.map((img) => {
                const isMarkedForDelete = form.deleteImages.includes(img);
                return (
                  <div key={img} className="relative group">
                    <img
                      src={img}
                      alt="trip"
                      className={`w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600 transition-all duration-300
          ${isMarkedForDelete ? 'opacity-40 grayscale' : ''}
        `}
                    />
                    <button
                      type="button"
                      onClick={() => handleImageDelete(img)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 shadow hover:bg-red-700 transition"
                    >
                      <FaTimes size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Current Video */}
        {trip?.video && (
          <div>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Current Video</label>
            <video
              src={trip.video}
              className={`w-full max-h-64 rounded-md border border-gray-300 dark:border-gray-600 shadow
              ${form.delVideo ? 'opacity-40 grayscale' : ''}`}
              controls
            />
            <button
              type="button"
              onClick={() => setForm({ ...form, delVideo: !form.delVideo })}
              className="mt-2 inline-block text-sm text-red-500 hover:text-red-600"
            >
              Remove Video
            </button>
          </div>
        )}

        {/* Upload New Images */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Upload New Images</label>
          <input
            type="file"
            multiple
            onChange={(e) => setNewImages(Array.from(e.target.files))}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
          />
        </div>

        {/* Upload New Video */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Upload New Video</label>
          <input
            type="file"
            onChange={(e) => setVideo(e.target.files[0])}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 rounded-md cursor-pointer"
          />
        </div>

        {/* Submit Button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Updating...' : 'Update Trip'}
        </button>
      </form>
    </div>
  );
};

export default EditTrip;