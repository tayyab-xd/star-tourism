'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';

// --- Reusable Button Component ---
const ModernButton = ({ children, type = 'submit', disabled = false }) => (
    <button type={type} disabled={disabled} className={`w-full px-6 py-3.5 font-semibold text-white bg-gray-800 rounded-xl shadow-md transform hover:-translate-y-0.5 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 ${disabled ? 'bg-gray-400 cursor-not-allowed' : 'hover:bg-gray-900'}`}>
        {children}
    </button>
);

export default function SignupPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/users/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            
            if (!res.ok) {
                throw new Error(data.message || 'Signup failed');
            }

            toast.success('Account created successfully! Please log in.');
            router.push('/login');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const inputClasses = "w-full px-4 py-3 bg-gray-100 rounded-xl border-2 border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-800 transition-all duration-300";

    return (
        <main className="min-h-screen font-sans bg-gray-50 text-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Star Tourism" className="mx-auto h-24 w-auto"/>
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mt-4">Create Your Account</h1>
                    <p className="max-w-md mx-auto mt-3 text-lg text-gray-500">Join us to start your next adventure.</p>
                </div>
                
                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                            <input required type="text" name="name" id="name" value={form.name} onChange={handleChange} placeholder="John Doe" className={inputClasses} />
                        </div>

                         <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                            <input required type="tel" name="phone" id="phone" value={form.phone} onChange={handleChange} placeholder="0300-1234567" className={inputClasses} />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email Address</label>
                            <input required type="email" name="email" id="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className={inputClasses} />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-1">Password</label>
                            <input required type="password" name="password" id="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClasses} />
                        </div>
                        
                        <div className="pt-2">
                            <ModernButton type="submit" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </ModernButton>
                        </div>

                        <p className="text-sm text-center text-gray-600 pt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-800">
                                Log in
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </main>
    );
}