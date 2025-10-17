// src/pages/AdminDashboard.jsx

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, Search, CheckCircle, CalendarClock, List, UserCog } from 'lucide-react';
import toast from 'react-hot-toast';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import SkeletonCard from '../components/SkeletonCard';
import ProfileDropdown from '../components/ProfileDropdown'; // Import the new component

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const response = await axios.get('http://localhost:5000/api/events', { headers: { Authorization: `Bearer ${token}` } });
      const eventsWithProgress = await Promise.all(
        response.data.map(async (event) => {
          const progressRes = await axios.get(`http://localhost:5000/api/tasks/progress/${event._id}`, { headers: { Authorization: `Bearer ${token}` } });
          return { ...event, progress: progressRes.data.progress };
        })
      );
      setEvents(eventsWithProgress);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      toast.error("Could not fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event = null) => { setCurrentEvent(event); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setCurrentEvent(null); };

  const handleSaveEvent = async (eventData) => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('token');
      const promise = currentEvent
        ? axios.put(`http://localhost:5000/api/events/${currentEvent._id}`, eventData, { headers: { Authorization: `Bearer ${token}` } })
        : axios.post('http://localhost:5000/api/events', eventData, { headers: { Authorization: `Bearer ${token}` } });
      await toast.promise(promise, {
        loading: 'Saving event...',
        success: `Event ${currentEvent ? 'updated' : 'created'} successfully!`,
        error: 'Failed to save event.',
      });
      handleCloseModal();
      await fetchEvents();
    } catch (error) {
      console.error('Failed to save event:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const promise = axios.delete(`http://localhost:5000/api/events/${eventId}`, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      await toast.promise(promise, {
        loading: 'Deleting event...',
        success: 'Event deleted successfully!',
        error: 'Failed to delete event.',
      });
      await fetchEvents();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName'); // Also remove the user's name
    toast.success('You have been logged out.');
    navigate('/login');
  };

  const eventStats = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const upcoming = events.filter(event => new Date(event.date) >= now);
    const completed = events.filter(event => new Date(event.date) < now);
    return {
      total: events.length,
      upcoming: upcoming.length,
      completed: completed.length,
    };
  }, [events]);

  const displayedEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    let eventsToShow = events;
    if (activeFilter === 'upcoming') {
      eventsToShow = events.filter(event => new Date(event.date) >= now);
    } else if (activeFilter === 'completed') {
      eventsToShow = events.filter(event => new Date(event.date) < now);
    }
    return eventsToShow.filter(event =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, activeFilter, searchTerm]);

  return (
    <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="shrink-0"><h1 className="text-3xl font-bold text-white">Admin Dashboard</h1></div>
          <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-md">
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-[#1F294A] border border-gray-600 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <div className="flex gap-2 sm:gap-4 items-center shrink-0">
            <Link to="/users" className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"><UserCog size={18} /><span className="hidden sm:inline">Users</span></Link>
            <Link to="/calendar" className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors"><Calendar size={18} /><span className="hidden sm:inline">Calendar</span></Link>
            <button onClick={() => handleOpenModal()} className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors"><Plus size={20} /><span className="hidden sm:inline">Add Event</span></button>
            <ProfileDropdown onLogout={handleLogout} />
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            ) : displayedEvents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {displayedEvents.map((event) => (<EventCard key={event._id} event={event} onDelete={handleDeleteEvent} onEdit={handleOpenModal} />))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#122142] rounded-xl">
                {searchTerm ? (<p className="text-gray-400 text-lg">No events found matching "{searchTerm}".</p>) : (<>
                  <p className="text-gray-400 text-lg">You have no {activeFilter !== 'all' ? activeFilter : ''} events.</p>
                  <p className="text-gray-500 mt-2">Click "Add New Event" to get started!</p>
                </>)}
              </div>
            )}
          </div>

          <div className="lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Summary</h2>
            <div className="space-y-4">
              <button onClick={() => setActiveFilter('all')} className={`w-full bg-[#122142] p-6 rounded-xl flex items-center gap-4 border-2 transition-colors ${activeFilter === 'all' ? 'border-amber-500' : 'border-transparent hover:border-gray-700'}`}>
                <div className="bg-blue-500/20 p-3 rounded-lg"><List className="text-blue-400" size={24} /></div>
                <div><p className="text-3xl font-bold text-left">{eventStats.total}</p><p className="text-gray-400 text-left">Total Events</p></div>
              </button>
              <button onClick={() => setActiveFilter('upcoming')} className={`w-full bg-[#122142] p-6 rounded-xl flex items-center gap-4 border-2 transition-colors ${activeFilter === 'upcoming' ? 'border-amber-500' : 'border-transparent hover:border-gray-700'}`}>
                <div className="bg-yellow-500/20 p-3 rounded-lg"><CalendarClock className="text-yellow-400" size={24} /></div>
                <div><p className="text-3xl font-bold text-left">{eventStats.upcoming}</p><p className="text-gray-400 text-left">Upcoming Events</p></div>
              </button>
              <button onClick={() => setActiveFilter('completed')} className={`w-full bg-[#122142] p-6 rounded-xl flex items-center gap-4 border-2 transition-colors ${activeFilter === 'completed' ? 'border-amber-500' : 'border-transparent hover:border-gray-700'}`}>
                <div className="bg-green-500/20 p-3 rounded-lg"><CheckCircle className="text-green-400" size={24} /></div>
                <div><p className="text-3xl font-bold text-left">{eventStats.completed}</p><p className="text-gray-400 text-left">Completed Events</p></div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <EventModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} eventToEdit={currentEvent} isSaving={isSaving} />
    </div>
  );
};

export default AdminDashboard;