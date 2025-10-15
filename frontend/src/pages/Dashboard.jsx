// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, Search } from 'lucide-react'; // Import the Search icon
import toast from 'react-hot-toast';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import SkeletonCard from '../components/SkeletonCard';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // State for the search bar
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const eventsWithProgress = await Promise.all(
        response.data.map(async (event) => {
          const progressRes = await axios.get(`http://localhost:5000/api/tasks/progress/${event._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
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

  const handleOpenModal = (event = null) => {
    setCurrentEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentEvent(null);
  };

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
      const promise = axios.delete(`http://localhost:5000/api/events/${eventId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

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
    toast.success('You have been logged out.');
    navigate('/login');
  };

  // Filter events based on the search term before rendering
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          {/* Left Section: Title */}
          <div className="shrink-0">
            <h1 className="text-3xl font-bold text-white">My Events</h1>
          </div>

          {/* Center Section: Search Bar */}
          <div className="relative w-full sm:w-auto sm:flex-grow sm:max-w-md">
            <input
              type="text"
              placeholder="Search events by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#1F294A] border border-gray-600 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Right Section: Action Buttons */}
          <div className="flex gap-2 sm:gap-4 items-center shrink-0">
            <Link to="/calendar" className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors">
              <Calendar size={18} />
              <span className="hidden sm:inline">Calendar</span>
            </Link>
            <button onClick={() => handleOpenModal()} className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors">
              <Plus size={20} />
              <span className="hidden sm:inline">Add Event</span>
            </button>
            <button onClick={handleLogout} className="bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
              Log Out
            </button>
          </div>
        </header>

        {/* Conditional rendering for loading, events, or empty states */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} onDelete={handleDeleteEvent} onEdit={handleOpenModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#122142] rounded-xl">
            {searchTerm ? (
              <p className="text-gray-400 text-lg">No events found matching "{searchTerm}".</p>
            ) : (
              <>
                <p className="text-gray-400 text-lg">You haven't created any events yet.</p>
                <p className="text-gray-500 mt-2">Click "Add New Event" to get started!</p>
              </>
            )}
          </div>
        )}
      </div>
      <EventModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} eventToEdit={currentEvent} isSaving={isSaving} />
    </div>
  );
};

export default Dashboard;