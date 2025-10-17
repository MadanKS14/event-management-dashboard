// src/pages/Dashboard.jsx

import React from 'react';
import AdminDashboard from './AdminDashboard';
import AttendeeDashboard from './AttendeeDashboard';

const Dashboard = () => {
    const userRole = localStorage.getItem('userRole');

    // Show the AdminDashboard if the user's role is 'Admin'
    if (userRole === 'Admin') {
        return <AdminDashboard />;
    }

    // Otherwise, show the simplified AttendeeDashboard
    return <AttendeeDashboard />;
};

export default Dashboard;