'use client'
import React, { useContext } from 'react';
import { AppContext } from '@/app/context/context';
import Link from 'next/link';
import { Compass } from 'lucide-react';

// --- Reusable Trip Card Component ---
const TripCard = ({ trip }) => {
    const { _id, name, description, images } = trip;

    return (
        <Link href={`/trips/all-trips/${_id}`} className="block group">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-full flex flex-col transform hover:scale-[1.03] hover:shadow-xl transition-all duration-400 ease-in-out">
                {/* Image Container */}
                <div className="w-full h-64 overflow-hidden">
                    <img
                        src={images[0]}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
                    />
                </div>
                
                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">{name}</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">
                        {description.slice(0, 100)}{description.length > 100 && '...'}
                    </p>
                    <div className="mt-auto">
                         <div className="bg-gray-800 text-white text-center font-semibold rounded-xl py-3 w-full transform group-hover:-translate-y-1 transition-transform duration-300 ease-in-out">
                            View Details
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};


const Trips = () => {
  const context = useContext(AppContext);
  const alltrips = context?.state?.allTrips || [];

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Explore Our Trips</h1>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-500">
                    Discover unforgettable destinations and create memories that will last a lifetime.
                </p>
            </div>

            {alltrips.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {alltrips.map((trip, index) => (
                    <div key={trip._id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <TripCard trip={trip} />
                    </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Compass size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">No Trips Available</h3>
                    <p className="text-gray-500 mt-2">Please check back later for new and exciting destinations!</p>
                </div>
            )}
        </div>
    </div>
  );
};

export default Trips;