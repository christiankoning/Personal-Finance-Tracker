import React from "react";
import SidebarLayout from "./SidebarLayout";

const Dashboard = () => {
    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recent Transactions Summary */}
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
        </SidebarLayout>
    );
};

export default Dashboard;
