'use client'
import React, { useContext, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AppContext } from '@/app/context/context';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const SingleTrip = () => {
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const params = useParams();
  const context = useContext(AppContext);
  const trip = context.state.allTrips.find((item) => item._id === params.id);

  const handleApply = async () => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('startourism')) : null;
    setLoading(true);
    if (user) {
      const formData = new FormData();
      formData.append('fullName', user.name);
      formData.append('email', user.email);
      formData.append('phoneNumber', user.phone);
      formData.append('tripName', trip.name);
      formData.append('type', 'existing');

      const body = {
        fullName: user.name,
        email: user.email,
        phone: user.phone,
        tripName: trip.name,
        type: 'Existing'
      };

      try {
        await fetch('/api/applications/apply', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`
          },
          body: JSON.stringify(body),
        });

        toast.success('Successfully applied for the trip!', {
          position: 'top-center',
          theme: 'dark',
        });
        setShowConfirmation(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        toast.error('Something went wrong. Please try again.', {
          position: 'top-center',
          theme: 'dark',
        });
        setLoading(false);
      }
    } else {
      router.push(`/login?from=/alltrips/${params.id}`);
    }
  };

  const deleteFunc = async () => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('startourism')) : null;
    const res = await fetch(`/api/trips/delete-trip/${trip._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
    })
  }
  
  return (
    <div className="single-trip min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-10 transition-colors duration-500">
      <ToastContainer />
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Application Submitted</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will be contacted via your registered <strong>email</strong> or <strong>phone</strong>.
            </p>
            <button
              onClick={() => setShowConfirmation(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {context.state.profileData.role === 'admin' && (
        <div>
          <Link href={`/trips/edit-trip/${trip && trip._id}`}>
            <button
              className="edit-button text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 rounded-lg px-4 py-2 mb-4"
            >
              Edit
            </button>
          </Link>
          <button
            onClick={deleteFunc}
            className="m-8 edit-button text-white bg-red-600 dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-400 rounded-lg px-4 py-2 mb-4"
          >
            Delete
          </button>
        </div>
      )}
      
      <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white mb-6">
        {trip?.name}
      </h1>

      {/* Images (no Swiper) */}
      {trip?.images && trip.images.length > 0 && (
        <div className="trip-images mb-8 flex flex-wrap gap-4 justify-center">
          {trip.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={trip.name}
              className="max-h-[300px] w-auto max-w-full object-contain rounded-lg shadow-lg"
            />
          ))}
        </div>
      )}

      {/* Video */}
      {trip?.video && (
        <div className="trip-video mb-8 flex justify-center">
          <video controls className="rounded-lg shadow-lg max-w-full max-h-[400px]">
            <source src={trip.video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      {/* Trip Details */}
      <div className="trip-details text-lg text-gray-700 dark:text-gray-300">
        <p><strong>Duration:</strong> {trip?.duration}</p>
        <p><strong>Price:</strong> Rs{trip?.price}</p>
        <p><strong>Description:</strong> {trip?.description}</p>
      </div>

      {/* Apply Button */}
      <button
        onClick={handleApply}
        disabled={loading}
        className="apply-button mt-6 text-white bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-400 rounded-full px-6 py-3"
      >
        {loading ? 'Applying...' : 'Apply'}
      </button>
    </div>
  );
};

export default SingleTrip;