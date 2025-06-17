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
    <main className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
  <form
    onSubmit={handleSubmit}
    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 sm:p-10 w-full max-w-md space-y-6 transition-all duration-300"
  >
    <h2 className="text-3xl font-extrabold text-center text-gray-900 dark:text-white">
      Create an Account
    </h2>

    <div>
      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Full Name
      </label>
      <input
        type="text"
        name="name"
        id="name"
        onChange={handleChange}
        required
        placeholder="Enter your name"
        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
      />
    </div>

    <div>
      <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Phone Number
      </label>
      <input
        type="text"
        name="phone"
        id="phone"
        onChange={handleChange}
        required
        placeholder="Enter your phone"
        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
      />
    </div>

    <div>
      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        id="email"
        onChange={handleChange}
        required
        placeholder="Enter your email"
        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
      />
    </div>

    <div>
      <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
        Password
      </label>
      <input
        type="password"
        name="password"
        id="password"
        onChange={handleChange}
        required
        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300"
      />
    </div>

    <button
      type="submit"
      className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white font-semibold rounded-xl transition duration-300"
    >
      Create Account
    </button>

    <button
      type="button"
      onClick={() => router.push('/login')}
      className="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-semibold rounded-xl transition duration-300"
    >
      Already have an account? Login
    </button>
  </form>
</main>

  );
}