'use client'
import React, { useContext } from 'react';
import { AppContext } from '../context/context';
import { User, Mail, Phone, MapPin, Calendar, Users, MessageSquare, Inbox } from 'lucide-react';

// --- Reusable Application Card Component ---
const ApplicationCard = ({ application, index }) => {
    const { type, fullName, email, phone, tripName, destination, days, persons, tripType, message, createdAt } = application;
    const isCustom = type === 'New';

    return (
        <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col transform hover:scale-[1.03] hover:shadow-xl transition-all duration-400 ease-in-out">
            {/* Card Header */}
            <div className={`p-5 border-b-2 ${isCustom ? 'border-blue-500' : 'border-green-500'}`}>
                <h3 className="font-bold text-lg text-gray-900">{isCustom ? 'Custom Trip Request' : 'Existing Trip Application'}</h3>
                <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleString()}</p>
            </div>
            
            {/* Card Body */}
            <div className="p-5 flex flex-col flex-grow space-y-5">
                {/* Applicant Details */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Applicant Details</h4>
                    <div className="flex items-center gap-3 text-gray-700"><User size={16} className="text-gray-400"/><span className="font-medium">{fullName}</span></div>
                    <div className="flex items-center gap-3 text-gray-700"><Mail size={16} className="text-gray-400"/><span className="font-medium">{email}</span></div>
                    <div className="flex items-center gap-3 text-gray-700"><Phone size={16} className="text-gray-400"/><span className="font-medium">{phone}</span></div>
                </div>

                {/* Trip Details */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                     <h4 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Trip Details</h4>
                     {tripName && <div className="font-semibold text-lg text-gray-800">{tripName}</div>}
                     {destination && <div className="flex items-center gap-3 text-gray-700"><MapPin size={16} className="text-gray-400"/><span>Destination: <strong>{destination}</strong></span></div>}
                     {days && <div className="flex items-center gap-3 text-gray-700"><Calendar size={16} className="text-gray-400"/><span>Days: <strong>{days}</strong></span></div>}
                     {persons && <div className="flex items-center gap-3 text-gray-700"><Users size={16} className="text-gray-400"/><span>Travelers: <strong>{persons}</strong></span></div>}
                     
                     {tripType && tripType.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                            {tripType.map(type => (
                                <span key={type} className="px-3 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">{type}</span>
                            ))}
                        </div>
                     )}

                     {message && <div className="flex items-start gap-3 text-gray-700 pt-2"><MessageSquare size={16} className="text-gray-400 mt-1 flex-shrink-0"/><p className="italic">"{message}"</p></div>}
                </div>
            </div>
        </div>
    );
};


function AllApplications() {
  const context = useContext(AppContext);
  const applications = context?.state?.applications || [];

  return (
    <div className="min-h-screen font-sans bg-gray-50 text-gray-800 p-4 sm:p-6 lg:p-8">
        <div className="container mx-auto">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">Trip Applications</h1>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-gray-500">
                    Review and manage all incoming requests for existing and custom-planned trips.
                </p>
            </div>

            {applications.length > 0 ? (
                <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    {applications.slice().reverse().map((item, index) => (
                        <div key={item._id || index} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                            <ApplicationCard application={item} index={index} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16">
                    <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700">No Applications Yet</h3>
                    <p className="text-gray-500 mt-2">When users apply for trips, their applications will appear here.</p>
                </div>
            )}
        </div>
    </div>
  );
}

export default AllApplications;