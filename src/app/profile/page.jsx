'use client'
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { User, Phone, Mail, Edit3, Save } from 'lucide-react';

// --- Reusable Components ---
const ModernButton = ({ children, onClick, type = 'button', disabled = false, variant = 'primary', className = '' }) => {
    const baseStyles = `w-full px-6 py-3 font-semibold rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2`;
    const variants = {
        primary: `bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-800 ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`,
        ghost: `bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400 shadow-sm`,
    };
    return <button type={type} onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</button>;
};

// --- Main Profile Page ---
function Profile() {
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
    });

    // ✅ Load localStorage data only on client
    useEffect(() => {
        const stored = localStorage.getItem('startourism');
        if (stored) {
            const parsed = JSON.parse(stored);
            setData(parsed);
            setFormData({
                name: parsed.name || '',
                phone: parsed.phone || '',
                email: parsed.email || '',
            });
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSave = async () => {
        if (!data) return;
        setLoading(true);
        try {
            const token = data?.token;
            await axios.put(`http://localhost:3000/user/update-user/${data._id}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            // ✅ Update localStorage with new data
            const updated = { ...data, ...formData };
            localStorage.setItem('startourism', JSON.stringify(updated));
            setData(updated);

            toast.success('Profile updated successfully!');
            setEdit(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-300";

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Loading profile...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
            
            <div className="w-full max-w-lg animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Your Profile</h1>
                    <p className="max-w-md mx-auto mt-4 text-lg text-gray-500">View and manage your personal information.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="p-8 flex flex-col items-center border-b border-gray-200">
                        <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                            {data?.name ? data.name.charAt(0).toUpperCase() : '?'}
                        </div>
                        {edit ? (
                            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your Name" className={`${inputClasses} text-center text-2xl font-bold`}/>
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-900">{data?.name}</h2>
                        )}
                         {edit ? (
                            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Your Email" className={`${inputClasses} text-center mt-2`}/>
                        ) : (
                             <p className="text-gray-500 mt-1">{data?.email}</p>
                        )}
                    </div>
                    
                    <div className="p-8 space-y-6">
                        <div>
                            <label className="flex items-center gap-3 text-sm font-medium text-gray-600 mb-2">
                                <Phone size={16}/>
                                <span>Phone Number</span>
                            </label>
                            {edit ? (
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="Your Phone Number" className={inputClasses}/>
                            ) : (
                                <p className="text-lg text-gray-800 font-medium ml-8">{data?.phone || 'Not provided'}</p>
                            )}
                        </div>
                        
                        <div className="pt-6">
                            {edit ? (
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <ModernButton onClick={handleSave} disabled={loading} variant="primary">
                                        <Save size={18}/>
                                        {loading ? 'Saving...' : 'Save Changes'}
                                    </ModernButton>
                                    <ModernButton onClick={() => setEdit(false)} variant="ghost">
                                        Cancel
                                    </ModernButton>
                                </div>
                            ) : (
                                <ModernButton onClick={() => setEdit(true)} variant="primary">
                                    <Edit3 size={18}/>
                                    Edit Profile
                                </ModernButton>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
