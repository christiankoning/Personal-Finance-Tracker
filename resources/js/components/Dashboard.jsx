import React, { useEffect, useState } from "react";
import axios from "axios";
import SidebarLayout from "./SidebarLayout";

const Dashboard = () => {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [spendingData, setSpendingData] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [loadingBudgets, setLoadingBudgets] = useState(true);
    const [errorTransactions, setErrorTransactions] = useState("");
    const [errorBudgets, setErrorBudgets] = useState("");

    useEffect(() => {
        // Fetch recent transactions
        const fetchRecentTransactions = async () => {
            try {
                const response = await axios.get("/api/transactions/recent", { withCredentials: true });
                setRecentTransactions(response.data);
            } catch (err) {
                setErrorTransactions("Failed to load recent transactions.");
            } finally {
                setLoadingTransactions(false);
            }
        };

        // Fetch spending data
        const fetchSpendingData = async () => {
            try {
                const response = await axios.get("/api/budgets/spending", { withCredentials: true });
                setSpendingData(response.data);
            } catch (err) {
                setErrorBudgets("Failed to load budget data.");
            } finally {
                setLoadingBudgets(false);
            }
        };

        fetchRecentTransactions();
        fetchSpendingData();
    }, []);

    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recent Transactions Summary */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Recent Transactions</h2>
                    {loadingTransactions && <p className="text-sm text-gray-500">Loading recent transactions...</p>}
                    {errorTransactions && <p className="text-sm text-red-500">{errorTransactions}</p>}
                    {!loadingTransactions && !errorTransactions && recentTransactions.length === 0 && (
                        <p className="text-sm text-gray-500">No recent transactions available.</p>
                    )}
                    {!loadingTransactions && !errorTransactions && recentTransactions.length > 0 && (
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
                    <h2 className="font-bold text-lg">Budget Summary</h2>
                    {loadingBudgets && <p className="text-sm text-gray-500">Loading budget data...</p>}
                    {errorBudgets && <p className="text-sm text-red-500">{errorBudgets}</p>}
                    {!loadingBudgets && !errorBudgets && spendingData
                        .sort((a, b) => {
                            const aPriority = a.spent > a.budget ? 2 : (a.spent / a.budget) >= 0.9 ? 1 : 0;
                            const bPriority = b.spent > b.budget ? 2 : (b.spent / b.budget) >= 0.9 ? 1 : 0;
                            if (bPriority !== aPriority) {
                                return bPriority - aPriority;
                            }
                            return (b.spent / b.budget) - (a.spent / a.budget);
                        })
                        .slice(0, 5)
                        .map(({ category, budget, spent }) => {
                            const spentValue = parseFloat(spent) || 0;
                            const percentage = Math.min((spentValue / budget) * 100, 100);
                            const barColor =
                                percentage < 75
                                    ? "bg-green-500"
                                    : percentage < 100
                                        ? "bg-yellow-500"
                                        : "bg-red-500";

                            return (
                                <div key={category} className="mb-4">
                                    <div className="flex justify-between">
                                        <span className="font-medium">{category}</span>
                                        <span
                                            className={`font-bold ${
                                                spentValue > budget ? "text-red-500" : "text-gray-700"
                                            }`}
                                        >
                                            ${spentValue.toFixed(2)} / ${budget.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                        <div
                                            className={`h-4 rounded-full ${barColor}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    <div className="text-right mt-4">
                        <a
                            href="/budgets"
                            className="text-blue-600 hover:underline text-sm"
                        >
                            View All Budgets
                        </a>
                    </div>
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
