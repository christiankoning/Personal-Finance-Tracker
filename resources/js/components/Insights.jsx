import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import axios from "axios";

const Insights = () => {
    const [spendingTrends, setSpendingTrends] = useState([]);
    const [incomeTrends, setIncomeTrends] = useState([]);
    const [budgetAdherence, setBudgetAdherence] = useState([]);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const spendingResponse = await axios.get("/api/insights/spending-trends", { withCredentials: true });
                const incomeResponse = await axios.get("/api/insights/income-trends", { withCredentials: true });
                const adherenceResponse = await axios.get("/api/insights/budget-adherence", { withCredentials: true });

                setSpendingTrends(spendingResponse.data);
                setIncomeTrends(incomeResponse.data);
                setBudgetAdherence(adherenceResponse.data);
            } catch (err) {
                console.error("Failed to load insights.");
            }
        };

        fetchInsights();
    }, []);

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-6">Insights</h1>

            {/* Spending Trends */}
            <div className="p-4 bg-white rounded-lg shadow mb-6">
                <h2 className="font-bold text-lg mb-4">Spending Trends</h2>
                <p className="text-sm text-gray-500">Graph of monthly spending trends (Coming Soon)</p>
            </div>

            {/* Income Trends */}
            <div className="p-4 bg-white rounded-lg shadow mb-6">
                <h2 className="font-bold text-lg mb-4">Income Trends</h2>
                <p className="text-sm text-gray-500">Graph of monthly income trends (Coming Soon)</p>
            </div>

            {/* Budget Adherence */}
            <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="font-bold text-lg mb-4">Budget Adherence</h2>
                <p className="text-sm text-gray-500">Graph of adherence to budgets (Coming Soon)</p>
            </div>
        </SidebarLayout>
    );
};

export default Insights;
