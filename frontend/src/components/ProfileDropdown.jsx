// src/components/ProfileDropdown.jsx

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const ProfileDropdown = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const userName = localStorage.getItem('userName') || 'User';
    const userInitial = userName.charAt(0).toUpperCase();

    // This effect handles closing the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Icon Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center font-bold text-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
                {userInitial}
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1F294A] rounded-md shadow-lg py-1 z-50 border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-sm text-white font-semibold">{userName}</p>
                    </div>
                    <Link
                        to="/account" // Placeholder link for a future account page
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                    >
                        <User size={16} /> Account
                    </Link>
                    <button
                        onClick={() => {
                            setIsOpen(false);
                            onLogout();
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                    >
                        <LogOut size={16} /> Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;