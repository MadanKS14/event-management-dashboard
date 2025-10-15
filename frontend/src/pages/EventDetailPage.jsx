// src/pages/EventDetailPage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, MapPin, Users, ClipboardList, UserPlus, X } from 'lucide-react';
import TaskItem from '../components/TaskItem';

const EventDetailPage = () => {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(0);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [newTaskName, setNewTaskName] = useState('');
    const [assignedAttendeeId, setAssignedAttendeeId] = useState('');

    const fetchProgress = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/tasks/progress/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setProgress(res.data.progress);
        } catch (error) { console.error("Failed to fetch progress:", error); }
    }, [id]);

    const fetchEventData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const [eventRes, tasksRes, usersRes] = await Promise.all([
                axios.get(`http://localhost:5000/api/events/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get(`http://localhost:5000/api/tasks/event/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${token}` } })
            ]);

            setEvent(eventRes.data);
            setTasks(tasksRes.data);
            setAllUsers(usersRes.data);

            if (eventRes.data?.attendees?.length > 0 && !assignedAttendeeId) {
                setAssignedAttendeeId(eventRes.data.attendees[0]._id);
            }
            await fetchProgress();
        } catch (error) {
            console.error("Failed to fetch data:", error);
            setEvent(null);
        } finally {
            setLoading(false);
        }
    }, [id, fetchProgress, assignedAttendeeId]);

    useEffect(() => {
        setLoading(true);
        fetchEventData();
    }, [id]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTaskName.trim() || !assignedAttendeeId) {
            return toast.error("Please provide a task name and select an assignee.");
        }
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/tasks', {
                name: newTaskName,
                deadline: new Date(),
                eventId: id,
                assignedAttendeeId,
                status: 'Pending', // New tasks are 'Pending' by default
            }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success('Task added successfully!');
            setNewTaskName('');
            await fetchEventData();
        } catch (error) {
            toast.error('Failed to add task.');
        }
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://localhost:5000/api/tasks/${taskId}`, { status: newStatus }, { headers: { Authorization: `Bearer ${token}` } });
            setTasks(tasks.map(task => task._id === taskId ? response.data : task));
            await fetchProgress();
        } catch (error) {
            console.error("Failed to update task status:", error);
            toast.error("Failed to update task status.");
        }
    };

    const handleAddAttendee = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post(`http://localhost:5000/api/events/${id}/attendees`, { userId }, { headers: { Authorization: `Bearer ${token}` } });
            toast.success("Attendee added!");
            await fetchEventData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add attendee');
        }
    };

    const handleRemoveAttendee = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:5000/api/events/${id}/attendees`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { userId }
            });
            toast.success("Attendee removed!");
            await fetchEventData();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove attendee');
        }
    };

    if (loading) {
        return <div className="bg-[#0A1931] min-h-screen flex justify-center items-center text-white text-xl">Loading...</div>;
    }

    if (!event) {
        return <div className="bg-[#0A1931] min-h-screen flex justify-center items-center text-white text-xl">Event not found.</div>;
    }

    const filteredUsers = searchTerm
        ? allUsers.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !event.attendees.some(attendee => attendee._id === user._id)
          )
        : [];

    return (
        <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-amber-400 hover:underline mb-6">
                    <ArrowLeft size={18} /> Back to Dashboard
                </Link>

                <div className="bg-[#122142] p-6 rounded-xl mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">{event.name}</h1>
                    <p className="text-gray-400 mb-4">{event.description}</p>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-gray-300">
                        <div className="flex items-center gap-2"><Calendar size={16} /><span>{new Date(event.date).toLocaleDateString('en-US', { dateStyle: 'full' })}</span></div>
                        <div className="flex items-center gap-2"><MapPin size={16} /><span>{event.location}</span></div>
                    </div>
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold text-gray-400">Event Progress</span>
                            <span className="text-sm font-bold text-white">{progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2.5">
                            <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-[#122142] p-6 rounded-xl">
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><ClipboardList /> Task Tracker</h2>
                        <form onSubmit={handleAddTask} className="flex flex-col sm:flex-row gap-2 mb-6">
                            <input type="text" value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)} placeholder="Add a new task..." className="flex-grow bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            <select value={assignedAttendeeId} onChange={(e) => setAssignedAttendeeId(e.target.value)} className="bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500">
                                <option value="" disabled>Assign to...</option>
                                {event.attendees.map(attendee => <option key={attendee._id} value={attendee._id}>{attendee.name}</option>)}
                            </select>
                            <button type="submit" className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-amber-600 transition-colors">Add Task</button>
                        </form>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {tasks.length > 0 ? (
                                tasks.map(task => (
                                    <TaskItem key={task._id} task={task} onStatusChange={handleUpdateTaskStatus} />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No tasks have been added for this event yet.</p>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-1 bg-[#122142] p-6 rounded-xl">
                        <h2 className="text-2xl font-bold flex items-center gap-2 mb-4"><Users /> Attendees ({event.attendees.length})</h2>
                        <div className="relative mb-4">
                            <input type="text" placeholder="Search users to add..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-[#0A1931] border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500" />
                            {filteredUsers.length > 0 && (
                                <div className="absolute top-full left-0 right-0 bg-[#1F294A] border border-gray-600 rounded-b-lg mt-1 max-h-48 overflow-y-auto z-10">
                                    {filteredUsers.map(user => (
                                        <div key={user._id} className="flex items-center justify-between p-2 hover:bg-[#0A1931]">
                                            <span>{user.name}</span>
                                            <button onClick={() => handleAddAttendee(user._id)} className="text-amber-400 hover:text-amber-200" title={`Add ${user.name}`}><UserPlus size={18} /></button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto">
                            {event.attendees.length > 0 ? (
                                event.attendees.map(attendee => (
                                    <div key={attendee._id} className="flex items-center justify-between p-2 bg-[#0A1931] rounded-lg">
                                        <div>
                                            <p className="font-semibold">{attendee.name}</p>
                                            <p className="text-xs text-gray-400">{attendee.email}</p>
                                        </div>
                                        <button onClick={() => handleRemoveAttendee(attendee._id)} className="text-gray-400 hover:text-red-500" title={`Remove ${attendee.name}`}><X size={18} /></button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">No attendees have been added yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EventDetailPage;