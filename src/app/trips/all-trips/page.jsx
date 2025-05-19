'use client'
import React, { useContext } from 'react';
import { AppContext } from '@/app/context/context';
import Link from 'next/link';

const Trips = () => {
  const context = useContext(AppContext);
  const alltrips = context.state.allTrips;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-10 transition-colors duration-500">
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        Explore Our Tour Packages
      </h2>

      <div className="destination-grid grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {alltrips && alltrips.map(item => (
          <div
            key={item._id}
            className="destination-card bg-white dark:bg-gray-800 shadow-md rounded-2xl overflow-hidden relative group"
          >
            <Link href={`/trips/all-trips/${item._id}`}>
              {/* Image */}
              <div className="relative h-96 w-full overflow-hidden rounded-t-2xl">
                <img
                  src={item.images[0]}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Name: Centered in the middle */}
              <h3
                className="absolute inset-0 flex items-center justify-center text-amber-500 text-3xl font-semibold z-10 group-hover:translate-y-[-10%] transition-transform duration-500"
              >
                {item.name}
              </h3>

              {/* Description and Button: Hidden by default and will slide up on hover */}
              <div
                className="absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black to-transparent rounded-b-2xl z-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
              >
                <p className="text-white mb-2">
                  {item.description.length > 100
                    ? item.description.substring(0, 100) + '...'
                    : item.description}
                </p>
                <button
                  className="view-button text-white bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-400 rounded-full px-4 py-2 transition-colors duration-300"
                >
                  View Details
                </button>
              </div>
            </Link>         </div>
        ))}
      </div>
    </div>
  );
};

export default Trips;