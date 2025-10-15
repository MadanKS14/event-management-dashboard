// src/components/EventModal.jsx

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import FormInput from './FormInput';

const EventModal = ({ isOpen, onClose, onSave, eventToEdit, isSaving }) => { // Add isSaving prop
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
  });

  useEffect(() => {
    if (eventToEdit) {
      setFormData({
        name: eventToEdit.name,
        description: eventToEdit.description,
        date: new Date(eventToEdit.date).toISOString().split('T')[0],
        location: eventToEdit.location,
      });
    } else {
      setFormData({ name: '', description: '', date: '', location: '' });
    }
  }, [eventToEdit, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  const isEditing = !!eventToEdit;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-[#122142] p-8 rounded-xl shadow-lg w-full max-w-lg border border-gray-700 mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput id="name" label="Event Name" type="text" placeholder="e.g., Annual Tech Summit" value={formData.name} onChange={handleChange} />
          <FormInput id="description" label="Description" type="text" placeholder="Describe your event" value={formData.description} onChange={handleChange} />
          <FormInput id="date" label="Date" type="date" value={formData.date} onChange={handleChange} />
          <FormInput id="location" label="Location" type="text" placeholder="e.g., Bengaluru" value={formData.location} onChange={handleChange} />

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving} // Disable cancel button during save
              className="py-2 px-4 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving} // Disable submit button during save
              className="py-2 px-4 bg-amber-500 text-black font-bold rounded-lg hover:bg-amber-600 transition-colors w-32 disabled:opacity-50"
            >
              {isSaving ? (
                <div className="animate-spin h-5 w-5 border-t-2 border-black rounded-full mx-auto"></div>
              ) : (
                isEditing ? 'Update Event' : 'Create Event'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EventModal;