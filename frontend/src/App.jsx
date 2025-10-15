// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Import the Toaster component

// Import Page Components
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import EventDetailPage from './pages/EventDetailPage';
import CalendarPage from './pages/CalendarPage';

// Import Utility Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <>
      {/* This component will render all toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            style: {
              background: '#22c55e', // Green
              color: 'white',
            },
          },
          error: {
            style: {
              background: '#ef4444', // Red
              color: 'white',
            },
          },
        }}
      />

      {/* Main application routing */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/event/:id"
          element={
            <ProtectedRoute>
              <EventDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;