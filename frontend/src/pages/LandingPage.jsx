// src/pages/LandingPage.js
import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="relative bg-[#0A1931] min-h-screen text-white flex flex-col items-center justify-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-900/50 via-transparent to-purple-900/50"></div>
      
      <Navbar />

      <main className="relative z-5 text-center p-8 mt-16">
        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
          The Art of Flawless Events, <span className="text-amber-400">Mastered.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          The all-in-one platform for professionals who demand excellence and deliver perfection. Orchestrate every detail with power and elegance.
        </p>
        <Link 
          to="/register" 
          className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold py-3 px-8 rounded-lg text-lg hover:from-yellow-500 hover:to-amber-600 transition-all duration-300"
        >
          Start Your Free Trial ▸
        </Link>
      </main>
    </div>
  );
};

export default LandingPage;