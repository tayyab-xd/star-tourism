'use client'
import React, { useState } from 'react';
// import axios from 'axios';

const UploadTrip = () => {
  const [tripData, setTripData] = useState({
    name: '',
    duration: '',
    price: '',
    description: '',
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTripData({ ...tripData, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);

    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    setVideo(file);
  };
  const token = JSON.parse(localStorage.getItem('startourism'));
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', tripData.name);
    formData.append('duration', tripData.duration);
    formData.append('price', tripData.price);
    formData.append('description', tripData.description);

    images.forEach((img) => {
      formData.append('images', img);
    });

    if (video) {
      formData.append('video', video);
    }

    await fetch('/api/trips/upload-trip', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token.token}`
          },
          body: formData,
        });
    setLoading(false);
  };

  return (
    <div className="upload-trip-container min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-10 transition-colors duration-500">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Add New Trip
      </h2>
      <form
        onSubmit={handleSubmit}
        className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6 transition-all duration-300"
      >
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Trip Name:</label>
          <input
            type="text"
            name="name"
            value={tripData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Duration:</label>
          <input
            type="text"
            name="duration"
            value={tripData.duration}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Price:</label>
          <input
            type="text"
            name="price"
            value={tripData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Description:</label>
          <textarea
            name="description"
            value={tripData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Images:</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
          />
        </div>

        {/* Image Previews */}
        <div className="image-preview-container flex flex-wrap gap-4">
          {imagePreviews.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Preview ${index}`}
              className="w-24 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600 shadow"
            />
          ))}
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Upload Video:</label>
          <input
            type="file"
            name="video"
            accept="video/*"
            onChange={handleVideoChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md cursor-pointer"
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300 disabled:opacity-50"
        >
          {loading ? 'Uploading...' : 'Upload Trip'}
        </button>
      </form>
    </div>
  );
};

export default UploadTrip;