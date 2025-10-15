// src/pages/CalendarPage.jsx

import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import './CalendarStyles.css'; // Import your new Tailwind-powered CSS file

const localizer = momentLocalizer(moment);

const CalendarPage = () => {
    const [events, setEvents] = useState([]);
    const [date, setDate] = useState(new Date());
    const [view, setView] = useState('month');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventsForCalendar = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/events', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const formattedEvents = response.data.map(event => ({
                    title: event.name,
                    start: new Date(event.date),
                    end: new Date(event.date),
                    resource: event,
                }));
                setEvents(formattedEvents);
            } catch (error) {
                console.error("Failed to fetch events:", error);
                if (error.response?.status === 401) {
                    navigate('/login');
                }
            }
        };
        fetchEventsForCalendar();
    }, [navigate]);

    const handleSelectEvent = (event) => {
        navigate(`/event/${event.resource._id}`);
    };

    const handleNavigate = (newDate) => {
        setDate(newDate);
    };

    const handleViewChange = (newView) => {
        setView(newView);
    };
    
    return (
        <div className="bg-[#0A1931] min-h-screen text-white p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto">
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-amber-400 hover:underline mb-6">
                    <ArrowLeft size={18} />
                    Back to Dashboard
                </Link>
                <h1 className="text-3xl font-bold text-white mb-6">Event Calendar</h1>
                <div className="bg-[#122142] p-4 rounded-xl h-[80vh]">
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectEvent={handleSelectEvent}
                        date={date}
                        view={view}
                        onNavigate={handleNavigate}
                        onView={handleViewChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;