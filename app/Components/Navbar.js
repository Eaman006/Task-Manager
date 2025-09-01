// Add this line at the top of your file
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  // State to manage mobile menu visibility
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Hook to get the current URL path
  const pathname = usePathname();

  const navLinks = [
    { href: '/home', name: 'Dashboard' },
    { href: '/task', name: 'Tasks' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-slate-50/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/home" className="text-2xl font-bold text-slate-800">
              Task Manager
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? 'text-blue-600 font-semibold'
                    : 'text-slate-700 hover:text-blue-600'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right side: CTA and User Avatar (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
              New Task +
            </button>
            <div className="w-9 h-9 bg-slate-300 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-500 hover:ring-offset-2">
              {/* User avatar image would go here */}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-800 hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                // Close Icon
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                // Hamburger Icon
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)} // Close menu on click
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  pathname === link.href
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
             <button className="w-full text-left mt-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-base font-semibold hover:bg-blue-700 transition-colors">
              New Task +
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;