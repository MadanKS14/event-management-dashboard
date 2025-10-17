// src/pages/AttendeeDashboard.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import ProfileDropdown from '../components/ProfileDropdown';
import { UserCheck } from 'lucide-react';

const AttendeeDashboard = () => {
    const [myTasks, setMyTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchMyTasks = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/tasks/mytasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyTasks(response.data);
        } catch (error) {
            toast.error("Could not fetch your tasks.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMyTasks();
    }, [fetchMyTasks]);

    const handleStatusChange = async (taskId, currentStatus) => {
        const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, 
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMyTasks(myTasks.map(task => task._id === taskId ? response.data : task));
            toast.success(`Task marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update task status.");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userName');
        toast.success('You have been logged out.');
        navigate('/login');
    };

    return (
        <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
            <header className="max-w-4xl mx-auto flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">My Assigned Tasks</h1>
                <ProfileDropdown onLogout={handleLogout} />
            </header>
            <main className="max-w-4xl mx-auto">
                <div className="bg-[#122142] p-6 rounded-xl">
                    {loading ? (
                        <p className="text-center text-gray-400">Loading your tasks...</p>
                    ) : myTasks.length > 0 ? (
                        <div className="space-y-3">
                            {myTasks.map(task => (
                                <div key={task._id} className="flex items-center justify-between p-4 bg-[#0A1931] rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="checkbox"
                                            checked={task.status === 'Completed'}
                                            onChange={() => handleStatusChange(task._id, task.status)}
                                            className="h-5 w-5 rounded bg-gray-700 border-gray-600 text-amber-500 focus:ring-amber-600 cursor-pointer"
                                        />
                                        <div>
                                            <p className={`text-white text-lg ${task.status === 'Completed' ? 'line-through text-gray-500' : ''}`}>
                                                {task.name}
                                            </p>
                                            <p className="text-sm text-gray-400">
                                                For Event: <span className="font-semibold">{task.event?.name || 'N/A'}</span>
                                            </p>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                <UserCheck size={14} />
                                                <span>Assigned by: {task.assignedBy?.name || 'Admin'}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${task.status === 'Completed' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'}`}>
                                        {task.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">You have no tasks assigned to you.</p>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AttendeeDashboard;