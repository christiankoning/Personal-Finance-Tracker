import React from "react";
import axios from "axios";

const Dashboard = () => {
    const handleLogout = async () => {
        try {
            const response = await axios.post(
                "/api/logout",
                {},
                { withCredentials: true }
            );
            alert(response.data.message);
            window.location.href = "/login";
        } catch (error) {
            alert(error.response?.data?.message || "Logout failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-600 text-white flex flex-col">
                <div className="p-4 text-center font-bold text-xl">
                    FinanceTracker
                </div>
                <nav className="flex-1">
                    <ul>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer">
                            Dashboard
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer">
                            Transactions
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer">
                            Budgeting
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer">
                            Insights
                        </li>
                    </ul>
                </nav>
                <button
                    onClick={handleLogout}
                    className="m-4 p-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 bg-gray-100 text-gray-800">
                <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Example Cards */}
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="font-bold text-lg">Recent Transactions</h2>
                        <p className="text-sm text-gray-500">View your latest expenses and income.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="font-bold text-lg">Monthly Budget</h2>
                        <p className="text-sm text-gray-500">Track your spending against your budget.</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="font-bold text-lg">Spending Trends</h2>
                        <p className="text-sm text-gray-500">Visualize your financial habits.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
