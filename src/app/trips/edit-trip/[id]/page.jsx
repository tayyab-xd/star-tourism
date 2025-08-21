'use client'
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { AppContext } from '@/app/context/context';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Image as ImageIcon, Film, Trash2 } from 'lucide-react';

// --- Reusable Components ---

const ModernButton = ({ children, type = 'submit', disabled = false, variant = 'primary', onClick }) => {
    const baseStyles = `w-full px-6 py-3.5 font-semibold rounded-xl shadow-md transform hover:-translatey-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2`;
    const variants = {
        primary: `bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-800 ${disabled ? 'bg-gray-400 cursor-not-allowed' : ''}`,
    };
    return <button type={type} disabled={disabled} onClick={onClick} className={`${baseStyles} ${variants.primary}`}>{children}</button>;
};

const FileUpload = ({ label, name, accept, onChange, multiple, icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-colors">
            <div className="space-y-1 text-center">
                {icon}
                <div className="flex text-sm text-gray-600">
                    <label htmlFor={name} className="relative cursor-pointer bg-white rounded-md font-medium text-gray-800 hover:text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500">
                        <span>Upload files</span>
                        <input id={name} name={name} type="file" className="sr-only" accept={accept} multiple={multiple} onChange={onChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
            </div>
        </div>
    </div>
);

// --- Main Edit Trip Page ---

const EditTrip = () => {
    const context = useContext(AppContext);
    const params = useParams();
    const router = useRouter();
    const id = params.id;

    const [loading, setLoading] = useState(false);
    const [trip, setTrip] = useState(null);
    const [form, setForm] = useState({ name: '', price: '', duration: '', description: '', delVideo: false, deleteImages: [] });
    const [newImages, setNewImages] = useState([]);
    const [video, setVideo] = useState(null);

    useEffect(() => {
        const data = context?.state?.allTrips?.find((item) => item._id === id);
        if (data) {
            setForm({ name: data.name, price: data.price, duration: data.duration, description: data.description, deleteImages: [], delVideo: false });
            setTrip(data);
        }
    }, [id, context?.state?.allTrips]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = JSON.parse(localStorage.getItem('startourism'))?.token;
            if (!token) throw new Error("Authentication token not found.");

            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('price', form.price);
            formData.append('duration', form.duration);
            formData.append('description', form.description);
            formData.append('delVideo', form.delVideo);
            formData.append('deleteImages', JSON.stringify(form.deleteImages));
            newImages.forEach(img => formData.append('newImages', img));
            if (video) formData.append('video', video);
            
            await axios.put(`/api/trips/update-trip/${id}`, formData, { headers: { Authorization: `Bearer ${token}` } });

            toast.success('Trip updated successfully!');
            router.push(`/trips/all-trips/${id}`);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update trip.');
        } finally {
            setLoading(false);
        }
    };

    const handleImageDeleteToggle = (imgUrl) => {
        setForm(prev => ({
            ...prev,
            deleteImages: prev.deleteImages.includes(imgUrl)
                ? prev.deleteImages.filter(item => item !== imgUrl)
                : [...prev.deleteImages, imgUrl]
        }));
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-300";

    if (!trip) {
        return (
             <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Trip Not Found</h2>
                    <p className="text-gray-500 mt-2">Could not find the trip you want to edit.</p>
                    <Link href="/trips/all-trips" className="mt-6 inline-block px-6 py-3 font-semibold text-white bg-gray-800 rounded-xl">
                        Back to All Trips
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen font-sans bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-5xl bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Edit Trip</h1>
                    <p className="max-w-xl mx-auto mt-4 text-lg text-gray-500">Update the details for "{trip.name}"</p>
                </div>
                
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Left Column: Trip Details */}
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Trip Name</label>
                            <input required type="text" id="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className={inputClasses} />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="duration" className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                                <input required type="text" id="duration" value={form.duration} onChange={e => setForm({...form, duration: e.target.value})} className={inputClasses} />
                            </div>
                            <div>
                                <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">Price (PKR)</label>
                                <input required type="number" id="price" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                            <textarea required id="description" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="8" className={inputClasses}></textarea>
                        </div>
                    </div>

                    {/* Right Column: Media Management */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Manage Current Images</label>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                                {trip.images.map(img => {
                                    const isMarked = form.deleteImages.includes(img);
                                    return (
                                        <div key={img} onClick={() => handleImageDeleteToggle(img)} className="relative group cursor-pointer">
                                            <img src={img} alt="trip" className={`w-full h-24 object-cover rounded-lg border-2 transition-all ${isMarked ? 'border-red-500' : 'border-transparent'}`} />
                                            <div className={`absolute inset-0 rounded-lg flex items-center justify-center bg-black/60 transition-opacity ${isMarked ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                <Trash2 className="text-white"/>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        
                        <FileUpload label="Upload New Images" name="newImages" accept="image/*" multiple onChange={e => setNewImages(Array.from(e.target.files))} icon={<ImageIcon className="w-10 h-10 mb-3 text-gray-400"/>} />

                        {trip.video && (
                             <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Manage Current Video</label>
                                <video src={trip.video} controls className={`w-full rounded-lg ${form.delVideo ? 'opacity-40 grayscale' : ''}`} />
                                <label className="flex items-center gap-2 mt-2 text-sm text-red-600 cursor-pointer">
                                    <input type="checkbox" checked={form.delVideo} onChange={e => setForm({...form, delVideo: e.target.checked})} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                                    Mark for deletion
                                </label>
                            </div>
                        )}
                        
                         <FileUpload label="Upload New Video (Optional)" name="newVideo" accept="video/*" onChange={e => setVideo(e.target.files[0])} icon={<Film className="w-10 h-10 mb-3 text-gray-400"/>} />
                    </div>
                    
                    {/* Submit Button (Full Width) */}
                    <div className="lg:col-span-2 pt-4">
                        <ModernButton type="submit" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Trip'}
                        </ModernButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTrip;