import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import SidebarLayout from "./SidebarLayout";
import { CurrencyContext } from "./CurrencyContext";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
);

const categoryColors = {
    Groceries: "rgba(235, 87, 87, 0.8)",
    Entertainment: "rgba(72, 207, 173, 0.8)",
    Utilities: "rgba(240, 196, 25, 0.8)",
    Rent: "rgba(51, 105, 232, 0.8)",
    Travel: "rgba(163, 95, 224, 0.8)",
    Transport: "rgba(0, 150, 136, 0.8)",
    Other: "rgba(124, 124, 124, 0.8)",
};

const getColorForCategory = (category) => categoryColors[category] || "rgba(100, 100, 100, 0.8)";

const Dashboard = () => {
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [spendingData, setSpendingData] = useState([]);
    const [incomeTrends, setIncomeTrends] = useState([]);
    const [budgetSummary, setBudgetSummary] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(true);
    const [loadingBudgets, setLoadingBudgets] = useState(true);
    const [errorTransactions, setErrorTransactions] = useState("");
    const [errorBudgets, setErrorBudgets] = useState("");
    const [incomeGoals, setIncomeGoals] = useState([]);
    const [budgetAdherence, setBudgetAdherence] = useState([]);

    // CurrencyContext variables
    const { selectedCurrency, currencyRates, currencySymbols } = useContext(CurrencyContext);

    // Helper functions for conversion and formatting
    const convertAmount = (amount, originalCurrency = "USD") => {
        if (!currencyRates[originalCurrency] || !currencyRates[selectedCurrency]) return amount;
        return (amount * currencyRates[selectedCurrency]) / currencyRates[originalCurrency];
    };

    const formatCurrency = (amount, currency = selectedCurrency) => {
        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${amount.toFixed(2)}`;
    };

    useEffect(() => {
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

        const fetchBudgetSummary = async () => {
            try {
                const response = await axios.get("/api/budgets/spending", { withCredentials: true });
                setBudgetSummary(response.data);
            } catch (err) {
                setErrorBudgets("Failed to load budget data.");
            } finally {
                setLoadingBudgets(false);
            }
        };

        const fetchIncomeGoals = async () => {
            try {
                const response = await axios.get("/api/goals", { withCredentials: true });
                setIncomeGoals(response.data);
            } catch (err) {
                console.error("Failed to load income goals.");
            }
        };

        const fetchSpendingData = async () => {
            try {
                const response = await axios.get("/api/insights/spending-trends", { withCredentials: true });
                setSpendingData(response.data);
            } catch (err) {
                console.error("Failed to load spending trends.");
            }
        };

        const fetchIncomeTrends = async () => {
            try {
                const response = await axios.get("/api/insights/income-trends", { withCredentials: true });
                setIncomeTrends(response.data);
            } catch (err) {
                console.error("Failed to load income trends.");
            }
        };

        const fetchBudgetAdherence = async () => {
            try {
                const response = await axios.get("/api/insights/budget-adherence", { withCredentials: true });
                setBudgetAdherence(response.data);
            } catch (err) {
                console.error("Failed to load budget adherence");
            }
        };

        fetchRecentTransactions();
        fetchSpendingData();
        fetchIncomeTrends();
        fetchBudgetSummary();
        fetchIncomeGoals();
        fetchBudgetAdherence();
    }, [selectedCurrency]);

    // Chart options with formatting
    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return value !== undefined && value !== null
                            ? formatCurrency(value)
                            : formatCurrency(0);
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: function (value) {
                        return formatCurrency(value);
                    },
                },
            },
        },
    };

    const doughnutChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const value = context.raw;
                        return value !== undefined && value !== null
                            ? formatCurrency(value)
                            : formatCurrency(0);
                    },
                },
            },
        },
    };

    const spendingChartData = {
        labels: [...new Set(spendingData.map((data) => data.month))],
        datasets: spendingData.reduce((datasets, { month, category, total }) => {
            let dataset = datasets.find((d) => d.label === category);
            if (!dataset) {
                dataset = {
                    label: category,
                    data: [],
                    backgroundColor: getColorForCategory(category),
                };
                datasets.push(dataset);
            }
            dataset.data.push(convertAmount(total));
            return datasets;
        }, []),
    };

    const incomeChartData = {
        labels: incomeTrends.map((data) => data.month),
        datasets: [
            {
                label: "Income",
                data: incomeTrends.map((data) => convertAmount(data.total)),
                fill: false,
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
            },
        ],
    };

    const budgetChartData = {
        labels: budgetAdherence.map((data) => data.category),
        datasets: [
            {
                data: budgetAdherence.map((data) => convertAmount(data.spent)),
                backgroundColor: budgetAdherence.map((data) => getColorForCategory(data.category)),
            },
        ],
    };
    return (
        <SidebarLayout>
            <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Recent Transactions */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Recent Transactions</h2>
                    {loadingTransactions && <p className="text-sm text-gray-500">Loading recent transactions...</p>}
                    {errorTransactions && <p className="text-sm text-red-500">{errorTransactions}</p>}
                    {!loadingTransactions && !errorTransactions && recentTransactions.length === 0 && (
                        <p className="text-sm text-gray-500">No recent transactions available.</p>
                    )}
                    {!loadingTransactions && !errorTransactions && recentTransactions.length > 0 && (
                        <ul className="space-y-2">
                            {recentTransactions.map((transaction) => {
                                const convertedAmount = convertAmount(transaction.amount, transaction.currency || "USD");
                                return (
                                    <li
                                        key={transaction.id}
                                        className="flex justify-between items-center p-2 border-b last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium">
                                                {transaction.category} - {transaction.type === "expense" ? "-" : "+"}
                                                {formatCurrency(transaction.amount, transaction.currency)} {/* Original */}
                                                {selectedCurrency !== transaction.currency && (
                                                    <span className="text-gray-500 text-sm ml-2">
                                        ({formatCurrency(convertedAmount, selectedCurrency)}) {/* Converted */}
                                    </span>
                                                )}
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
                                );
                            })}
                        </ul>
                    )}
                </div>

                {/* Monthly Budget Summary */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Budget Summary</h2>
                    {loadingBudgets && <p className="text-sm text-gray-500">Loading budget data...</p>}
                    {errorBudgets && <p className="text-sm text-red-500">{errorBudgets}</p>}
                    {!loadingBudgets && !errorBudgets && budgetSummary.length > 0 ? (
                        <ul>
                            {budgetSummary.map(({ category, budget, spent, currency }) => {
                                const convertedSpent = convertAmount(spent, currency);
                                const convertedBudget = convertAmount(budget, currency);
                                const percentage = Math.min((convertedSpent / convertedBudget) * 100, 100);
                                const barColor =
                                    percentage < 75
                                        ? "bg-green-500"
                                        : percentage < 100
                                            ? "bg-yellow-500"
                                            : "bg-red-500";

                                return (
                                    <li key={category} className="mb-4 border-b last:border-0 py-2">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <span className="font-medium">{category}</span>
                                                <span className="ml-4 font-bold">
                                                    {formatCurrency(spent, currency)} / {formatCurrency(budget, currency)} {/* Original */}
                                                    {selectedCurrency !== currency && (
                                                        <span className="text-gray-500 text-sm ml-2">
                                                            ({formatCurrency(convertedSpent, selectedCurrency)} /{" "}
                                                            {formatCurrency(convertedBudget, selectedCurrency)}) {/* Converted */}
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                            <div
                                                className={`h-4 rounded-full ${barColor}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        {spent > budget && (
                                            <p className="text-sm text-red-500 mt-2">
                                                You’ve exceeded your budget for this category!
                                            </p>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-sm text-gray-500">No budgets or spending data available.</p>
                    )}
                </div>

                {/* Income Goals */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Income Goals</h2>
                    {incomeGoals.length === 0 ? (
                        <p className="text-sm text-gray-500">No income goals set.</p>
                    ) : (
                        incomeGoals
                            .slice(0, 5)
                            .map(({ id, category, amount, progress, deadline, currency }) => {
                                const convertedProgress = convertAmount(progress, currency);
                                const convertedAmount = convertAmount(amount, currency);
                                const percentage = Math.min((progress / amount) * 100, 100);
                                const barColor =
                                    percentage < 75
                                        ? "bg-green-500"
                                        : percentage < 100
                                            ? "bg-yellow-500"
                                            : "bg-blue-500";

                                return (
                                    <div key={id} className="mb-4">
                                        <div className="flex justify-between">
                                            <span className="font-medium">{category}</span>
                                            <span
                                                className={`font-bold ${
                                                    percentage >= 100 ? "text-blue-500" : "text-gray-700"
                                                }`}
                                            >
                                {formatCurrency(progress, currency)}{" "}
                                                {selectedCurrency !== currency && (
                                                    <span className="text-gray-500 text-sm ml-2">
                                        ({formatCurrency(convertedProgress, selectedCurrency)})
                                    </span>
                                                )}
                                                {" "} / {formatCurrency(amount, currency)}{" "}
                                                {selectedCurrency !== currency && (
                                                    <span className="text-gray-500 text-sm ml-2">
                                        ({formatCurrency(convertedAmount, selectedCurrency)})
                                    </span>
                                                )}
                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                            <div
                                                className={`h-4 rounded-full ${barColor}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        {deadline && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                Target Date: {new Date(deadline).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                );
                            })
                    )}
                    <div className="text-right mt-4">
                        <a href="/goals" className="text-blue-600 hover:underline text-sm">
                            View All Income Goals
                        </a>
                    </div>
                </div>

                {/* Spending Trends */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Spending Trends</h2>
                    {spendingData.length > 0 ? (
                        <div className="h-48">
                            <Bar data={spendingChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No spending trends data available.</p>
                    )}
                </div>

                {/* Income Trends */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Income Trends</h2>
                    {incomeTrends.length > 0 ? (
                        <div className="h-48">
                            <Line data={incomeChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No income trends available.</p>
                    )}
                </div>

                {/* Budget Adherence */}
                <div className="p-4 bg-white rounded-lg shadow">
                    <h2 className="font-bold text-lg">Budget Adherence</h2>
                    {budgetAdherence.length > 0 ? (
                        <div className="h-48">
                            <Doughnut data={budgetChartData} options={doughnutChartOptions} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No budget adherence data available.</p>
                    )}
                </div>
            </div>
        </SidebarLayout>
    );
};

export default Dashboard;
