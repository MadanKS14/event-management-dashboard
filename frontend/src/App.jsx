import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Events from './pages/Events'
import Attendees from './pages/Attendees'
import Tasks from './pages/Tasks'
import Calendar from './pages/Calender'
import Sidebar from './components/Sidebar'
import Navbar from './components/Navbar'


export default function App() {
return (
<div className="min-h-screen flex">
<Sidebar />
<div className="flex-1">
<Navbar />
<main className="p-6">
<Routes>
<Route path="/" element={<Navigate to="/dashboard" replace />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/events" element={<Events />} />
<Route path="/attendees" element={<Attendees />} />
<Route path="/tasks" element={<Tasks />} />
<Route path="/calendar" element={<Calendar />} />
</Routes>
</main>
</div>
</div>
)
}