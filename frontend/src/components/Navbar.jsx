// src/components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-transparent absolute top-0 left-0 w-full z-10 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-white">EventaSphere ✨</Link>

        {/* Navigation Links and Buttons */}
        <div>
          <Link to="/login" className="text-white hover:text-amber-400 transition-colors duration-300 mr-4">
            Log In
          </Link>
          <Link to="/register" className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors duration-300">
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;