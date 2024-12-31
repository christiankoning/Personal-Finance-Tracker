import React from 'react';
import axios from 'axios';

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            const response = await axios.post('/api/logout');
            alert(response.data.message);
            window.location.href = '/login';
        } catch (error) {
            alert('Logout failed. Please try again.');
        }
    };

    return (
        <div>
            <h1>Welcome to the Dashboard</h1>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Dashboard;
