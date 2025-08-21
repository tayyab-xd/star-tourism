'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import imageCompression from 'browser-image-compression';
import { toast } from 'react-toastify';
import { UploadCloud, Film, Image as ImageIcon, X } from 'lucide-react';

// --- Reusable Components ---

const ModernButton = ({ children, type = 'submit', disabled = false }) => (
    <button type={type} disabled={disabled} className={`w-full px-6 py-3.5 font-semibold text-white bg-gray-800 rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-900'}`}>
        {children}
    </button>
);

const FileUpload = ({ label, name, accept, onChange, multiple, icon }) => (
    <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-gray-400 transition-colors duration-300">
            <div className="space-y-1 text-center">
                {icon}
                <div className="flex text-sm text-gray-600">
                    <label htmlFor={name} className="relative cursor-pointer bg-white rounded-md font-medium text-gray-800 hover:text-gray-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-gray-500">
                        <span>Upload files</span>
                        <input id={name} name={name} type="file" className="sr-only" accept={accept} multiple={multiple} onChange={onChange} />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
        </div>
    </div>
);

// --- Main Upload Trip Page ---

const UploadTrip = () => {
    const router = useRouter();
    const [tripData, setTripData] = useState({ name: '', duration: '', price: '', description: '' });
    const [images, setImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTripData({ ...tripData, [name]: value });
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        toast.info("Compressing images, please wait...");
        const compressedImages = [];
        const previews = [];

        for (let file of files) {
            try {
                const compressedFile = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true });
                compressedImages.push(compressedFile);
                previews.push(URL.createObjectURL(compressedFile));
            } catch (error) {
                toast.error("Image compression failed for one or more images.");
            }
        }
        setImages(prev => [...prev, ...compressedImages]);
        setImagePreviews(prev => [...prev, ...previews]);
    };

    const removeImage = (indexToRemove) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
        setImagePreviews(imagePreviews.filter((_, index) => index !== indexToRemove));
    };

    const handleVideoChange = (e) => setVideo(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = JSON.parse(localStorage.getItem('startourism'))?.token;
            if (!token) throw new Error("Authentication token not found.");

            const formData = new FormData();
            Object.keys(tripData).forEach(key => formData.append(key, tripData[key]));
            images.forEach(img => formData.append('images', img));
            if (video) formData.append('video', video);

            const response = await fetch('/api/trips/upload-trip', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            if (!response.ok) throw new Error('Upload failed');
            
            toast.success("Trip uploaded successfully!");
            // Reset form
            setTripData({ name: '', duration: '', price: '', description: '' });
            setImages([]);
            setImagePreviews([]);
            setVideo(null);
            router.push('/trips/all-trips');

        } catch (error) {
            toast.error(error.message || "An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-300";

    return (
        <div className="min-h-screen font-sans bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg animate-fade-in-up">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Add a New Trip</h1>
                    <p className="max-w-xl mx-auto mt-4 text-lg text-gray-500">Fill in the details below to add a new travel package to the platform.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Trip Name</label>
                        <input required type="text" name="name" id="name" value={tripData.name} onChange={handleChange} placeholder="e.g., Majestic Hunza Valley Tour" className={inputClasses} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-600 mb-1">Duration</label>
                            <input required type="text" name="duration" id="duration" value={tripData.duration} onChange={handleChange} placeholder="e.g., 7 Days, 6 Nights" className={inputClasses} />
                        </div>
                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-600 mb-1">Price (PKR)</label>
                            <input required type="number" name="price" id="price" value={tripData.price} onChange={handleChange} placeholder="e.g., 50000" className={inputClasses} />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                        <textarea required name="description" id="description" value={tripData.description} onChange={handleChange} rows="5" placeholder="Describe the trip itinerary, highlights, and inclusions..." className={inputClasses}></textarea>
                    </div>

                    <FileUpload label="Upload Images" name="images" accept="image/*" onChange={handleImageChange} multiple icon={<ImageIcon className="w-10 h-10 mb-3 text-gray-400"/>} />

                    {imagePreviews.length > 0 && (
                        <div>
                            <h3 className="text-sm font-medium text-gray-600">Image Previews:</h3>
                            <div className="flex gap-4 mt-2 flex-wrap">
                                {imagePreviews.map((preview, i) => (
                                    <div key={i} className="relative">
                                        <img src={preview} alt="preview" className="w-28 h-28 object-cover rounded-lg border border-gray-200" />
                                        <button type="button" onClick={() => removeImage(i)} className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold hover:bg-red-700 transition-transform hover:scale-110"><X size={14}/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    <FileUpload label="Upload Video (Optional)" name="video" accept="video/*" onChange={handleVideoChange} icon={<Film className="w-10 h-10 mb-3 text-gray-400"/>} />
                    {video && <p className="text-sm text-center text-gray-500">Selected Video: <span className="font-medium">{video.name}</span></p>}

                    <div className="pt-4">
                        <ModernButton type="submit" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload Trip'}
                        </ModernButton>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UploadTrip;