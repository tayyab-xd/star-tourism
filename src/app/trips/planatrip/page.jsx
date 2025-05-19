'use client'
import { AppContext } from '@/app/context/context';
import React, { useContext, useState } from 'react';

const PlanATrip = () => {
  const context=useContext(AppContext)
  const user=context.state.profileData
  const [formData, setFormData] = useState({
    destination: '',
    days: '',
    persons: '',
    tripType: [],
    message: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      const updatedTripType = e.target.checked
        ? [...formData.tripType, e.target.value]
        : formData.tripType.filter((t) => t !== e.target.value);

      setFormData({
        ...formData,
        tripType: updatedTripType,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = JSON.parse(localStorage.getItem('startourism'));

      await fetch('/api/applications/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token.token}`
        },
        body: JSON.stringify({
          destination: formData.destination,
          days: formData.days,
          tripType: formData.tripType,
          persons: formData.persons,
          message: formData.message,
          fullName: user.name,
          email: user.email,
          phone: user.phone
        }),
      });


      setShowConfirmation(true);
      setFormData({
        destination: '',
        days: '',
        persons: '',
        tripType: [],
        message: '',
      });


    } catch (error) {
      console.error('Error submitting trip:', error);
      alert('Submission failed. Please try again.');
    }
  };

  return (
    <div className="plan-trip-container min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-10 transition-colors duration-500">
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-lg text-center">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Trip Planned Successfully!</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              You will be contacted via email or phone regarding your customized trip.
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

      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">Customize Your Trip</h2>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 space-y-6 transition-all duration-300"
      >
        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Destination:</label>
          <input
            required
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Days:</label>
          <input
            required
            type="text"
            name="days"
            value={formData.days}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Number of Travelers:</label>
          <input
            required
            type="number"
            name="persons"
            value={formData.persons}
            onChange={handleChange}
            min="1"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <fieldset className="border border-gray-300 dark:border-gray-600 rounded-md p-4">
          <legend className="text-gray-700 dark:text-gray-300 font-medium mb-2">Trip Type:</legend>
          <div className="flex flex-wrap gap-4">
            {['Adventure', 'Family', 'Honeymoon', 'Relaxation'].map((type) => (
              <label key={type} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  name="tripType"
                  value={type}
                  checked={formData.tripType.includes(type)}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                />
                {type}
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Special Requests:</label>
          <textarea
            required
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button
          type="submit"
          className="cta-button w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 dark:hover:bg-blue-500 transition duration-300"
        >
          Plan My Trip
        </button>
      </form>
    </div>
  );
};

export default PlanATrip;
