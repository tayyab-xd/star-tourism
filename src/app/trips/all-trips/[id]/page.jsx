'use client'
import React, { useContext, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { AppContext } from '@/app/context/context';
import { toast } from 'react-toastify';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { Edit, Trash2, Clock, DollarSign, CheckCircle, X } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// --- Reusable Components ---

const ModernButton = ({ children, onClick, disabled = false, variant = 'primary', className = '' }) => {
    const baseStyles = `w-full px-6 py-3 font-semibold rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2`;
    const variants = {
        primary: `bg-green-600 text-white hover:bg-green-700 focus:ring-green-600 ${disabled ? 'bg-green-300 cursor-not-allowed' : ''}`,
        secondary: `bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-400`,
        danger: `bg-red-600 text-white hover:bg-red-700 focus:ring-red-600`,
    };
    return <button onClick={onClick} disabled={disabled} className={`${baseStyles} ${variants[variant]} ${className}`}>{children}</button>;
};

const ConfirmationModal = ({ onClose }) => (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative text-center animate-fade-in-up">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"><X size={20} /></button>
            <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">Thank you for your interest. We will contact you shortly via your registered email or phone number.</p>
            <button onClick={onClose} className="w-full px-6 py-2.5 font-semibold text-white bg-gray-800 rounded-xl hover:bg-gray-900 transition">OK</button>
        </div>
    </div>
);


const SingleTrip = () => {
    const [loading, setLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const router = useRouter();
    const params = useParams();
    const context = useContext(AppContext);
    
    const trip = context?.state?.allTrips?.find((item) => item._id === params.id);
    const isAdmin = context?.state?.profileData?.role === 'admin';
    const user = context?.state?.profileData;

    const handleApply = async () => {
        if (!user) {
            toast.warn("Please log in to apply for a trip.");
            router.push(`/signup?from=/trips/all-trips/${params.id}`);
            return;
        }

        setLoading(true);
        try {
            const body = {
                fullName: user.name,
                email: user.email,
                phone: user.phone,
                tripName: trip.name,
                type: 'Existing'
            };
            await fetch('/api/applications/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
                body: JSON.stringify(body),
            });
            setShowConfirmation(true);
        } catch (err) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to permanently delete this trip?")) return;
        
        try {
            await fetch(`/api/trips/delete-trip/${trip._id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
            });
            toast.success("Trip deleted successfully.");
            router.push('/trips/all-trips');
        } catch(error) {
            toast.error("Failed to delete the trip.");
        }
    };

    if (!trip) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center text-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Trip Not Found</h2>
                    <p className="text-gray-500 mt-2">The trip you are looking for does not exist or may have been removed.</p>
                    <Link href="/trips/all-trips" className="mt-6 inline-block px-6 py-3 font-semibold text-white bg-gray-800 rounded-xl">
                        Back to All Trips
                    </Link>
                </div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen font-sans bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
            {showConfirmation && <ConfirmationModal onClose={() => setShowConfirmation(false)} />}
            
            <div className="container mx-auto max-w-7xl">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-8 lg:space-y-0">
                    
                    {/* Left Column: Media & Description */}
                    <main className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden animate-fade-in-up">
                            <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} loop={true} autoplay={{ delay: 4000 }}>
                                {trip.images.map((img, i) => (
                                    <SwiperSlide key={i}><img src={img} alt={`Trip image ${i + 1}`} className="w-full h-auto aspect-[16/10] object-cover" /></SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                        
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <h2 className="text-3xl font-bold text-gray-900">Trip Overview</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{trip.description}</p>
                        </div>

                        {trip.video && (
                            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                                <h2 className="text-3xl font-bold text-gray-900">Experience the Journey</h2>
                                <video controls className="w-full rounded-lg aspect-video">
                                    <source src={trip.video} type="video/mp4" />
                                    Your browser does not support the video tag.
                                </video>
                            </div>
                        )}
                    </main>

                    {/* Right Sidebar: Details & Actions */}
                    <aside className="lg:sticky lg:top-24 h-fit animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg space-y-6">
                            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">{trip.name}</h1>
                            <div className="border-t border-gray-200 pt-5 space-y-3">
                                <div className="flex items-center gap-3 text-lg">
                                    <Clock size={20} className="text-gray-500" />
                                    <span className="font-semibold text-gray-800">Duration:</span>
                                    <span className="text-gray-600">{trip.duration}</span>
                                </div>
                                <div className="flex items-center gap-3 text-lg">
                                    <DollarSign size={20} className="text-gray-500" />
                                    <span className="font-semibold text-gray-800">Price:</span>
                                    <span className="text-gray-600">Rs {trip.price.toLocaleString()}</span>
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-5 space-y-3">
                                <ModernButton onClick={handleApply} disabled={loading} variant="primary">
                                    {loading ? 'Submitting...' : 'Apply Now'}
                                </ModernButton>
                                {isAdmin && (
                                    <div className="flex gap-3">
                                        <Link href={`/trips/edit-trip/${trip._id}`} className="w-full">
                                            <ModernButton variant="secondary"><Edit size={16} /> Edit</ModernButton>
                                        </Link>
                                        <ModernButton onClick={handleDelete} variant="danger"><Trash2 size={16} /> Delete</ModernButton>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>
    );
};

export default SingleTrip;