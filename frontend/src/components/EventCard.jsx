// src/components/EventCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react';

const EventCard = ({ event, onDelete, onEdit }) => {
  // We'll make this progress value dynamic in a later step
  const progress = event.progress || 0;

  return (
    <Link to={`/event/${event._id}`} className="block">
      <div className="bg-[#122142] rounded-xl shadow-lg p-5 flex flex-col justify-between border-2 border-transparent hover:border-amber-500 transition-all duration-300 h-full">
        
        {/* Top section of the card */}
        <div>
          {/* Header with Title and Action Buttons */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white pr-4">{event.name}</h3>
            
            {/* Wrapper to stop button clicks from triggering the navigation link */}
            <div className="flex gap-3 z-10" onClick={(e) => e.preventDefault()}>
              <button onClick={() => onEdit(event)} className="text-gray-400 hover:text-amber-400" title="Edit Event">
                <Edit size={18} />
              </button>
              <button onClick={() => onDelete(event._id)} className="text-gray-400 hover:text-red-500" title="Delete Event">
                <Trash2 size={18} />
              </button>
            </div>
          </div>

          {/* Event Description */}
          <p className="text-gray-400 text-sm mb-4 h-10 overflow-hidden">{event.description}</p>
          
          {/* Date and Location Details */}
          <div className="space-y-3 text-gray-300">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{event.location}</span>
            </div>
          </div>
        </div>

        {/* Bottom section with Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-gray-400">Task Progress</span>
            <span className="text-sm font-bold text-white">{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
      </div>
    </Link>
  );
};

export default EventCard;