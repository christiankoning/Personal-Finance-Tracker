import React, { useState, useEffect, useContext } from "react";
import SidebarLayout from "./SidebarLayout";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import { CurrencyContext } from "./CurrencyContext";
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

const getColorForCategory = (category) => categoryColors[category] || "rgba(100, 100, 100, 0.5)";

const Insights = () => {
    const [spendingTrends, setSpendingTrends] = useState([]);
    const [incomeTrends, setIncomeTrends] = useState([]);
    const [budgetAdherence, setBudgetAdherence] = useState([]);

    const { selectedCurrency, currencyRates, currencySymbols } = useContext(CurrencyContext);

    // Helper: Convert amount based on currency
    const convertAmount = (amount, originalCurrency = "USD") => {
        if (!currencyRates[originalCurrency] || !currencyRates[selectedCurrency]) return amount;
        return (amount * currencyRates[selectedCurrency]) / currencyRates[originalCurrency];
    };

    // Helper: Format currency
    const formatCurrency = (amount, currency = selectedCurrency) => {
        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${parseFloat(amount || 0).toFixed(2)}`; // Ensure amount is parsed as a number
    };

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const spendingResponse = await axios.get("/api/insights/spending-trends", { withCredentials: true });
                const incomeResponse = await axios.get("/api/insights/income-trends", { withCredentials: true });
                const adherenceResponse = await axios.get("/api/insights/budget-adherence", { withCredentials: true });

                // Validate and clean data
                setSpendingTrends(spendingResponse.data || []);
                setIncomeTrends(incomeResponse.data || []);
                setBudgetAdherence(adherenceResponse.data || []);
            } catch (err) {
                console.error("Failed to load insights.");
            }
        };

        fetchInsights();
    }, [selectedCurrency]);

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
                        const value = parseFloat(context.raw || 0); // Ensure value is a number
                        return formatCurrency(value);
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
                        const value = parseFloat(context.raw || 0); // Ensure value is a number
                        return formatCurrency(value);
                    },
                },
            },
        },
    };

    const spendingChartData = {
        labels: [...new Set(spendingTrends.map((data) => data.month))],
        datasets: spendingTrends.reduce((datasets, { month, category, total }) => {
            const validTotal = parseFloat(total || 0); // Ensure total is a number
            let dataset = datasets.find((d) => d.label === category);
            if (!dataset) {
                dataset = {
                    label: category,
                    data: [],
                    backgroundColor: getColorForCategory(category),
                };
                datasets.push(dataset);
            }
            dataset.data.push(validTotal);
            return datasets;
        }, []),
    };

    const incomeChartData = {
        labels: incomeTrends.map((data) => data.month),
        datasets: [
            {
                label: "Income",
                data: incomeTrends.map(({ total }) => parseFloat(total || 0)), // Ensure total is a number
                backgroundColor: "rgba(75, 192, 192, 0.5)",
                borderColor: "rgba(75, 192, 192, 1)",
                borderWidth: 1,
            },
        ],
    };

    const budgetChartData = {
        labels: budgetAdherence.map((data) => data.category),
        datasets: [
            {
                data: budgetAdherence.map(({ spent }) => parseFloat(spent || 0)), // Ensure spent is a number
                backgroundColor: budgetAdherence.map((data) => getColorForCategory(data.category)),
            },
        ],
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-6">Insights</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Spending Trends */}
                <div className="p-4 bg-white rounded-lg shadow w-full">
                    <h2 className="font-bold text-lg mb-4">Spending Trends</h2>
                    {spendingTrends.length > 0 ? (
                        <div className="h-64">
                            <Bar data={spendingChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No spending data available.</p>
                    )}
                </div>

                {/* Income Trends */}
                <div className="p-4 bg-white rounded-lg shadow w-full">
                    <h2 className="font-bold text-lg mb-4">Income Trends</h2>
                    {incomeTrends.length > 0 ? (
                        <div className="h-64">
                            <Line data={incomeChartData} options={chartOptions} />
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No income data available.</p>
                    )}
                </div>

                {/* Budget Adherence */}
                <div className="p-4 bg-white rounded-lg shadow w-full md:col-span-2">
                    <h2 className="font-bold text-lg mb-4">Budget Adherence</h2>
                    {budgetAdherence.length > 0 ? (
                        <div className="h-64">
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

export default Insights;
