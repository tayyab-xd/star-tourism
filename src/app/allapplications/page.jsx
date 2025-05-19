'use client'
import React, { useContext } from 'react';
import { AppContext } from '../context/context';

function AllApplications() {
  const context = useContext(AppContext);
  const data = context.state?.applications;

  // Helper to render a field if it exists
  const renderField = (label, value) =>
    value ? (
      <p className="mb-2 text-gray-700 dark:text-gray-300">
        <strong>{label}:</strong> {value}
      </p>
    ) : null;

  // Helper for tripType (array or string)
  const renderTripType = (tripType) => {
    if (!tripType) return null;
    if (Array.isArray(tripType)) {
      if (tripType.length === 0) return null;
      return renderField('Trip Type', tripType.join(', '));
    }
    return renderField('Trip Type', tripType);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-10 transition-colors duration-500">
      <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
        All Trip Applications
      </h1>

      {data && data.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.slice().reverse().map((item, i) => (
            <div
              key={item._id || i}
              className="application-card bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-6 transition-all hover:shadow-2xl hover:-translate-y-2 hover:scale-105 animate-fade-in"
            >
              <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-4">
                Application #{data.length - i}
              </h2>
              <p className="mb-4 text-sm text-gray-500 dark:text-gray-400 italic">
                {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'No date'}
              </p>
              {renderField('Type', item.type)}
              {renderField('Full Name', item.fullName)}
              {renderField('Email', item.email)}
              {renderField('Phone', item.phone)}
              {renderField('Trip Name', item.tripName)}
              {renderField('Destination', item.destination)}
              {renderField('Days', item.days)}
              {renderField('Travelers', item.persons)}
              {renderTripType(item.tripType)}
              {renderField('Requests', item.message)}
            </div>
          ))}
        </div>
      ) : (
        <h2 className="text-xl text-center text-gray-600 dark:text-gray-300">No applications yet</h2>
      )}
    </div>
  );
}

export default AllApplications;