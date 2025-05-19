'use client'
import React, { useContext, useState } from 'react';
import { AppContext } from '../context/context';
// import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [edit, setEdit] = useState(false);
  const context = useContext(AppContext);
  const data = context.state.profileData;

  const [formData, setFormData] = useState({
    name: data?.name || '',
    phone: data?.phone || '',
    email: data?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:3000/user/update-user/${data._id}`, formData);
      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setEdit(false);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to update, Please try again.');
    }
  };

  return (
    <div className="profile-container min-h-screen bg-gray-100 dark:bg-gray-900 py-10 px-4 sm:px-10 transition-colors duration-500">
      <ToastContainer />
      <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Profile
      </h2>
      <div className="profile-card max-w-lg mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 transition-all duration-300">
        {edit ? (
          <>
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Phone:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 mb-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-between">
              <button
                className="save-button bg-green-600 text-white px-4 py-2 rounded-md shadow hover:bg-green-700 transition duration-300"
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="cancel-button bg-red-600 text-white px-4 py-2 rounded-md shadow hover:bg-red-700 transition duration-300"
                onClick={() => setEdit(false)}
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Name: <span className="font-normal">{data?.name}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
              Phone: <span className="font-normal">{data?.phone}</span>
            </h3>
            <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
              Email: <span className="font-normal">{data?.email}</span>
            </h3>
            <button
              className="edit-button bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 transition duration-300"
              onClick={() => setEdit(true)}
            >
              Edit
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;