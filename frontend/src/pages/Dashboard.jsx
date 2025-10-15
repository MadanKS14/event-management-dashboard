// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';
import SkeletonCard from '../components/SkeletonCard'; // Import the skeleton card

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // State for initial page load
  const [isSaving, setIsSaving] = useState(false); // State for modal save/update actions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const navigate = useNavigate();

  const fetchEvents = async () => {
    setLoading(true); // Start loading when fetching
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
      setLoading(false); // Stop loading when fetch is complete
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
      fetchEvents();
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
      
      // Refetch events to ensure consistency
      fetchEvents();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('You have been logged out.');
    navigate('/login');
  };

  return (
    <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Events</h1>
            <p className="text-gray-400 mt-1">Here’s what you’ve got planned.</p>
          </div>
          <div className="flex gap-4 mt-4 sm:items-center sm:mt-0">
            <Link to="/calendar" className="bg-gray-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-gray-700 transition-colors">
              <Calendar size={18} />
              Calendar View
            </Link>
            <button onClick={() => handleOpenModal()} className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors">
              <Plus size={20} />
              Add New Event
            </button>
            <button onClick={handleLogout} className="bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors">
              Log Out
            </button>
          </div>
        </header>

        {/* Conditional rendering for loading state */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} onDelete={handleDeleteEvent} onEdit={handleOpenModal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#122142] rounded-xl">
            <p className="text-gray-400 text-lg">You haven't created any events yet.</p>
            <p className="text-gray-500 mt-2">Click "Add New Event" to get started!</p>
          </div>
        )}
      </div>
      <EventModal isOpen={isModalOpen} onClose={handleCloseModal} onSave={handleSaveEvent} eventToEdit={currentEvent} isSaving={isSaving} />
    </div>
  );
};

export default Dashboard;