import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarLayout from "./SidebarLayout";

const Dashboard = () => {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchRecentTransactions = async () => {
            try {
                const response = await axios.get("/api/transactions/recent", { withCredentials: true });
                setRecentTransactions(response.data);
            } catch (err) {
                setError("Failed to load recent transactions.");
            } finally {
                setLoading(false);
            }
        };

        fetchRecentTransactions();
    }, []);

    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recent Transactions Summary */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Recent Transactions</h2>
                    {loading && <p className="text-sm text-gray-500">Loading recent transactions...</p>}
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {!loading && !error && recentTransactions.length === 0 && (
                        <p className="text-sm text-gray-500">No recent transactions available.</p>
                    )}
                    {!loading && !error && recentTransactions.length > 0 && (
                        <ul className="space-y-2">
                            {recentTransactions.map((transaction) => (
                                <li
                                    key={transaction.id}
                                    className="flex justify-between items-center p-2 border-b last:border-0"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {transaction.category} - {transaction.type === "expense" ? "-" : "+"}$
                                            {transaction.amount.toFixed(2)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(transaction.transaction_date).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span
                                            className={`px-2 py-1 text-xs rounded ${
                                                transaction.type === "expense"
                                                    ? "bg-red-100 text-red-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}
                                        >
                                            {transaction.type.charAt(0).toUpperCase() +
                                            transaction.type.slice(1)}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Monthly Budget Summary */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Monthly Budget</h2>
                    <p className="text-sm text-gray-500">Track your spending against your budget.</p>
                </div>

                {/* Spending Trends */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Spending Trends</h2>
                    <p className="text-sm text-gray-500">Visualize your financial habits.</p>
                </div>
            </div>
        </SidebarLayout>
    );
};

export default Dashboard;
