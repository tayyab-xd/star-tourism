'use client';

import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AppContext } from '../context/context';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt, FaSignInAlt, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = () => {
  const pathname = usePathname();
  const context = useContext(AppContext);
  const checkLogin = context?.state?.profileData;
  const [menuOpen, setMenuOpen] = useState(false);
  const [login, setLogin] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('startourism');
    context.dispatch({ type: 'PROFILE_CLEAR' });
    setLogin(false);
    setMenuOpen(false);
  };

  useEffect(() => {
    const storedData = localStorage.getItem('startourism');
    if (storedData) {
      setLogin(true);
    }
  }, [checkLogin]);

  const navLinkClass = (href) =>
    `transition duration-300 ease-in-out ${pathname === href ? 'text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-700 dark:text-gray-200'
    } hover:text-blue-600 dark:hover:text-blue-400`;

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-blue-600 flex items-center gap-2 dark:text-blue-400">
          <img className="h-20" src="/logo.png" alt="Star Tourism" />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {checkLogin?.role === 'admin' && (
            <>
              <Link href="/trips/uploadtrip" className={navLinkClass('/uploadtrip')}>Upload Trip</Link>
              <Link href="/allapplications" className={navLinkClass('/applications')}>Applications</Link>
            </>
          )}
          {checkLogin?.email && (
            <Link href="/profile" className={`${navLinkClass('/profile')} flex items-center gap-1`}>
              <FaUserCircle /> Profile
            </Link>
          )}

          <Link href="/" className={navLinkClass('/')}>Home</Link>
          <Link href="/trips/all-trips" className={navLinkClass('/trips')}>All Trips</Link>
          <Link href="/trips/planatrip" className={navLinkClass('/planatrip')}>Plan a Trip</Link>



          {login ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-red-600 hover:text-red-700 transition duration-300"
            >
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <Link
              href="/signup"
              className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 transition duration-300"
            >
              <FaSignInAlt /> Login/SignUp
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Icon */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)} className="text-2xl">
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-800 px-6 py-4 shadow-lg flex flex-col space-y-4">
          {checkLogin?.role === 'admin' && (
            <>
              <Link
                href="/trips/uploadtrip"
                className={navLinkClass('/trips/uploadtrip')}
                onClick={() => setMenuOpen(false)}
              >
                Upload Trip
              </Link>
              <Link
                href="/applications"
                className={navLinkClass('/applications')}
                onClick={() => setMenuOpen(false)}
              >
                Applications
              </Link>
            </>
          )}

          {checkLogin?.email && (
            <Link
              href="/profile"
              className={navLinkClass('/profile')}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          )}

          <Link
            href="/"
            className={navLinkClass('/')}
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>

          <Link
            href="/trips/all-trips"
            className={navLinkClass('/trips/all-trips')}
            onClick={() => setMenuOpen(false)}
          >
            All Trips
          </Link>

          <Link
            href="/trips/planatrip"
            className={navLinkClass('/trips/planatrip')}
            onClick={() => setMenuOpen(false)}
          >
            Plan a Trip
          </Link>

          {login ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="text-red-600 hover:text-red-700 w-full text-left transition duration-300"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/signup"
              className="block text-blue-600 hover:text-blue-700 transition duration-300"
              onClick={() => setMenuOpen(false)}
            >
              Login / SignUp
            </Link>
          )}
        </div>
      )}

    </nav>
  );

};

export default Navbar;
