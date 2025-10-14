// src/pages/Dashboard.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import EventCard from '../components/EventCard';
import EventModal from '../components/EventModal';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const navigate = useNavigate();

  // Fetches all events and their corresponding progress
  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      // 1. Fetch all events
      const response = await axios.get('http://localhost:5000/api/events', {
        headers: { Authorization: `Bearer ${token}` },
      });

      // 2. For each event, create a promise to fetch its progress
      const eventsWithProgress = await Promise.all(
        response.data.map(async (event) => {
          const progressRes = await axios.get(`http://localhost:5000/api/tasks/progress/${event._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          // 3. Combine event data with its progress
          return { ...event, progress: progressRes.data.progress };
        })
      );

      setEvents(eventsWithProgress); // 4. Set the final combined data to state
    } catch (error) {
      console.error('Failed to fetch events:', error);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
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
    const token = localStorage.getItem('token');
    try {
      if (currentEvent) {
        await axios.put(`http://localhost:5000/api/events/${currentEvent._id}`, eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event updated successfully!');
      } else {
        await axios.post('http://localhost:5000/api/events', eventData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Event created successfully!');
      }
      
      handleCloseModal();
      fetchEvents();

    } catch (error) {
      console.error('Failed to save event:', error);
      alert('Failed to save event.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(events.filter((event) => event._id !== eventId));
        alert('Event deleted successfully!');
      } catch (error) {
        console.error('Failed to delete event:', error);
        alert('Failed to delete event.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    alert('You have been logged out.');
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
          <div className="flex gap-4 mt-4 sm:mt-0">
            <button 
              onClick={() => handleOpenModal()}
              className="bg-amber-500 text-black font-bold py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-amber-600 transition-colors"
            >
              <Plus size={20} />
              Add New Event
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600/80 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
            >
              Log Out
            </button>
          </div>
        </header>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onDelete={handleDeleteEvent}
                onEdit={handleOpenModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#122142] rounded-xl">
            <p className="text-gray-400 text-lg">You haven't created any events yet.</p>
            <p className="text-gray-500 mt-2">Click "Add New Event" to get started!</p>
          </div>
        )}
      </div>

      <EventModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEvent}
        eventToEdit={currentEvent}
      />
    </div>
  );
};

export default Dashboard;