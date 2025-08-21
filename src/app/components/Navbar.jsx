'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  LogIn,
  Compass,
  Plane,
  FilePlus,
  ClipboardList,
} from 'lucide-react';

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileData, setProfileData] = useState(null);

  const profileRef = useRef(null);

  // Load user data from localStorage
  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = JSON.parse(localStorage.getItem('startourism'));
      if (!storedUser) {
        setLoadingProfile(false);
        return;
      }
      try {
        const res = await fetch(`/api/users/getuser/${storedUser.userId}`);
        const data = await res.json();
        setProfileData(data);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchUser();
  }, []);

  const isLoggedIn = !loadingProfile && !!profileData;
  const isAdmin = profileData?.role === 'admin';
  const userName = profileData?.name || 'User';

  const handleLogout = () => {
    localStorage.removeItem('startourism');
    setProfileData(null);
    setProfileOpen(false);
    setMenuOpen(false);
    router.push('/signup');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { href: '/', text: 'Home', icon: <Compass /> },
    { href: '/trips/all-trips', text: 'All Trips', icon: <Plane /> },
    { href: '/trips/planatrip', text: 'Plan a Trip', icon: <FilePlus /> },
  ];

  const adminLinks = [
    { href: '/trips/uploadtrip', text: 'Upload Trip', icon: <FilePlus /> },
    { href: '/allapplications', text: 'Applications', icon: <ClipboardList /> },
  ];

  const activeLinkClass = 'bg-gray-100 text-gray-900';
  const inactiveLinkClass =
    'text-gray-500 hover:bg-gray-100 hover:text-gray-900';

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm font-sans">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <img className="h-16 w-auto" src="/logo.png" alt="Star Tourism" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  pathname === link.href ? activeLinkClass : inactiveLinkClass
                }`}
              >
                {link.text}
              </Link>
            ))}
            {isAdmin &&
              adminLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                    pathname === link.href ? activeLinkClass : inactiveLinkClass
                  }`}
                >
                  {link.text}
                </Link>
              ))}
          </div>

          {/* Profile / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {loadingProfile ? (
              <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
            ) : isLoggedIn ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-white rounded-full p-1 pr-3 hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  <div className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-white font-bold text-base">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold text-gray-800">
                    {userName}
                  </span>
                </button>
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 origin-top-right"
                    >
                      <div className="p-2">
                        <div className="px-4 py-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900">
                            {userName}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {profileData?.email}
                          </p>
                        </div>
                        <div className="border-t my-1 border-gray-200"></div>
                        <Link
                          href="/profile"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                          <User size={16} className="mr-3" /> Profile
                        </Link>
                        <div className="border-t my-1 border-gray-200"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2.5 text-sm text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <LogOut size={16} className="mr-3" /> Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link
                  href="/signup"
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2.5 rounded-lg text-sm font-semibold bg-gray-800 text-white hover:bg-gray-900"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 rounded-lg hover:bg-gray-100"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {[...navLinks, ...(isAdmin ? adminLinks : [])].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold ${
                    pathname === link.href ? activeLinkClass : inactiveLinkClass
                  }`}
                >
                  {link.icon}
                  {link.text}
                </Link>
              ))}

              <div className="border-t border-gray-200 pt-4 mt-4">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold ${
                        pathname === '/profile'
                          ? activeLinkClass
                          : inactiveLinkClass
                      }`}
                    >
                      <User /> Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50"
                    >
                      <LogOut /> Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg text-base font-semibold bg-gray-800 text-white hover:bg-gray-900"
                  >
                    <LogIn /> Login / Sign Up
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
