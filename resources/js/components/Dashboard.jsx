import React from 'react';
import axios from 'axios';

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                '/api/logout',
                {},
                { withCredentials: true } // Ensure cookies are sent
            );
            alert(response.data.message);
            window.location.href = '/login'; // Redirect to login
        } catch (error) {
            alert(error.response?.data?.message || 'Logout failed. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 text-gray-800 flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Welcome to the Dashboard</h1>
            <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;
