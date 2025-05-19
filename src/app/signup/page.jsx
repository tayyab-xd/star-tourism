'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    alert(data.message);
  };

  return (
    <main className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required className="input" />
        <input type="text" name="phone" placeholder="phone" onChange={handleChange} required className="input" />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required className="input" />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required className="input" />
        <button type="submit" className="btn">Create Account</button>
        <button
          type="button"
          className="btn mt-2 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          onClick={() => router.push('/login')}
        >
          Go to Login
        </button>
      </form>
    </main>
  );
}