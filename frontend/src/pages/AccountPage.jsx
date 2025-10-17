// src/pages/AccountPage.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, User, Lock } from 'lucide-react';

const AccountPage = () => {
    // State for the active tab
    const [activeTab, setActiveTab] = useState('profile');
    
    // State for profile form
    const [name, setName] = useState(localStorage.getItem('userName') || '');

    // State for password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        const promise = axios.put('http://localhost:5000/api/users/profile', 
            { name },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        toast.promise(promise, {
            loading: 'Updating profile...',
            success: 'Profile updated successfully!',
            error: 'Failed to update profile.',
        });

        try {
            const response = await promise;
            // Update the name in localStorage for immediate UI update
            localStorage.setItem('userName', response.data.name);
        } catch (error) {
            console.error(error);
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error("New passwords do not match.");
        }

        const promise = axios.put('http://localhost:5000/api/users/change-password', 
            { currentPassword, newPassword },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        toast.promise(promise, {
            loading: 'Changing password...',
            success: 'Password changed successfully!',
            error: (err) => err.response?.data?.message || 'Failed to change password.',
        });

        try {
            await promise;
            // Clear password fields on success
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-amber-400 hover:underline mb-8">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <h1 className="text-4xl font-bold text-white mb-8">Account Settings</h1>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Left Navigation */}
                    <aside className="md:w-1/4">
                        <nav className="space-y-2">
                            <button onClick={() => setActiveTab('profile')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-[#1F294A]' : 'hover:bg-[#122142]'}`}>
                                <User size={20} /> Profile
                            </button>
                            <button onClick={() => setActiveTab('security')} className={`w-full text-left flex items-center gap-3 p-3 rounded-lg transition-colors ${activeTab === 'security' ? 'bg-[#1F294A]' : 'hover:bg-[#122142]'}`}>
                                <Lock size={20} /> Security
                            </button>
                        </nav>
                    </aside>

                    {/* Right Content */}
                    <main className="md:w-3/4 bg-[#122142] p-6 rounded-xl">
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2" required />
                                    </div>
                                    <div className="pt-2">
                                        <button type="submit" className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg">Save Changes</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-6">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Current Password</label>
                                        <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">New Password</label>
                                        <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-1">Confirm New Password</label>
                                        <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2" required />
                                    </div>
                                    <div className="pt-2">
                                        <button type="submit" className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg">Update Password</button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AccountPage;