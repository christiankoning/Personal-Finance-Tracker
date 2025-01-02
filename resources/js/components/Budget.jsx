import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import CategoryDropdown from "./CategoryDropdown";
import EditBudgetModal from "./EditBudgetModal";
import axios from "axios";

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [spendingData, setSpendingData] = useState([]);
    const [formData, setFormData] = useState({ category: "", customCategory: "", amount: "" });
    const [error, setError] = useState("");
    const [selectedBudget, setSelectedBudget] = useState(null);

    useEffect(() => {
        const fetchBudgetsAndSpending = async () => {
            try {
                const budgetResponse = await axios.get("/api/budgets", { withCredentials: true });
                setBudgets(budgetResponse.data);

                const spendingResponse = await axios.get("/api/budgets/spending", { withCredentials: true });
                setSpendingData(spendingResponse.data);
            } catch (err) {
                console.error("Failed to fetch budgets or spending data");
            }
        };

        fetchBudgetsAndSpending();
    }, []);

    const handleCategoryChange = ({ category, customCategory }) => {
        setFormData({ ...formData, category, customCategory });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalCategory =
            formData.category === "Other" ? formData.customCategory : formData.category;

        if (!finalCategory) {
            setError("Please select or provide a category.");
            return;
        }

        // Check for duplicate category
        if (budgets.some((budget) => budget.category === finalCategory)) {
            setError("This category already has a budget. Please edit the existing budget.");
            return;
        }

        try {
            const response = await axios.post(
                "/api/budgets",
                { ...formData, category: finalCategory },
                { withCredentials: true }
            );
            const newBudget = response.data;

            // Fetch updated spending data
            const spendingResponse = await axios.get("/api/budgets/spending", { withCredentials: true });
            const updatedSpending = spendingResponse.data.find(
                (data) => data.category === newBudget.category
            );

            setBudgets((prev) => [...prev, newBudget]);
            setSpendingData((prev) => [
                ...prev.filter((data) => data.category !== newBudget.category),
                {
                    category: updatedSpending.category,
                    budget: newBudget.amount,
                    spent: updatedSpending.spent,
                },
            ]);

            setFormData({ category: "", customCategory: "", amount: "" });
        } catch (err) {
            setError("Failed to add budget. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/budgets/${id}`, { withCredentials: true });
            setBudgets((prev) => prev.filter((budget) => budget.id !== id));
            setSpendingData((prev) => prev.filter((data) => data.category !== budgets.find((b) => b.id === id)?.category));
        } catch (err) {
            console.error("Failed to delete budget.", err);
        }
    };

    const handleBudgetUpdated = (updatedBudget) => {
        setBudgets((prev) =>
            prev.map((budget) => (budget.category === updatedBudget.category ? updatedBudget : budget))
        );
        setSpendingData((prev) =>
            prev.map((data) =>
                data.category === updatedBudget.category
                    ? { ...data, budget: updatedBudget.amount }
                    : data
            )
        );
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-6">Manage Budgets</h1>
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                <CategoryDropdown
                    category={formData.category}
                    customCategory={formData.customCategory}
                    onCategoryChange={handleCategoryChange}
                    filterType="expense"
                    showCustomType={false}
                />
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                        required
                    />
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Add Budget
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>

            <h2 className="text-xl font-bold mb-4">Your Budgets</h2>
            <div className="bg-white rounded-lg shadow p-4">
                {spendingData.length === 0 ? (
                    <p className="text-sm text-gray-500">No budgets or spending data available.</p>
                ) : (
                    <ul>
                        {spendingData.map(({ category, budget, spent }) => {
                            const spentValue = parseFloat(spent) || 0;
                            const percentage = Math.min((spentValue / budget) * 100, 100);
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
                                            <span
                                                className={`ml-4 font-bold ${
                                                    spentValue > budget ? "text-red-500" : "text-gray-700"
                                                }`}
                                            >
                                                ${spentValue.toFixed(2)} / ${budget.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            {/* Edit Button */}
                                            <button
                                                onClick={() =>
                                                    setSelectedBudget({
                                                        id: budgets.find((budget) => budget.category === category)?.id,
                                                        category,
                                                        amount: budget,
                                                    })
                                                }
                                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                            >
                                                Edit
                                            </button>
                                            {/* Delete Button */}
                                            <button
                                                onClick={() => handleDelete(budgets.find((budget) => budget.category === category)?.id)}
                                                className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-4 mt-2">
                                        <div
                                            className={`h-4 rounded-full ${barColor}`}
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    {spentValue > budget && (
                                        <p className="text-sm text-red-500 mt-2">
                                            You’ve exceeded your budget for this category!
                                        </p>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>

            {selectedBudget && (
                <EditBudgetModal
                    budget={selectedBudget}
                    onClose={() => setSelectedBudget(null)}
                    onBudgetUpdated={handleBudgetUpdated}
                />
            )}
        </SidebarLayout>
    );
};

export default Budgets;
