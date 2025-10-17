// src/pages/UserManagementPage.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, UserPlus } from 'lucide-react';

const UserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // State for the new user form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Attendee'); // Default role for new users

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            toast.error("Could not fetch users. You may not have permission.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        const promise = axios.post('http://localhost:5000/api/users', 
            { name, email, password, role },
            { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );

        toast.promise(promise, {
            loading: 'Creating user...',
            success: 'User created successfully!',
            error: (err) => err.response?.data?.message || 'Failed to create user.',
        });

        try {
            await promise;
            // Reset form and refetch users on success
            setName('');
            setEmail('');
            setPassword('');
            setRole('Attendee');
            fetchUsers();
        } catch (error) {
            console.error("User creation failed:", error);
        }
    };

    return (
        <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-amber-400 hover:underline mb-6">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: User List */}
                    <div className="lg:col-span-2 bg-[#122142] p-6 rounded-xl">
                        <h1 className="text-3xl font-bold text-white mb-6">User Management</h1>
                        {loading ? (
                            <p>Loading users...</p>
                        ) : (
                            <div className="space-y-3">
                                {users.map(user => (
                                    <div key={user._id} className="flex justify-between items-center bg-[#0A1931] p-4 rounded-lg">
                                        <div>
                                            <p className="font-semibold">{user.name}</p>
                                            <p className="text-sm text-gray-400">{user.email}</p>
                                        </div>
                                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${user.role === 'Admin' ? 'bg-amber-500 text-black' : 'bg-gray-600 text-white'}`}>
                                            {user.role}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right Column: Add User Form */}
                    <div className="lg:col-span-1 bg-[#122142] p-6 rounded-xl self-start">
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><UserPlus /> Add New User</h2>
                        <form onSubmit={handleCreateUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" required />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                    <option value="Attendee">Attendee</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-amber-500 text-black font-bold py-2 rounded-lg hover:bg-amber-600 transition-colors">Create User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage;