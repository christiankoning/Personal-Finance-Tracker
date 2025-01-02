import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import CategoryDropdown from "./CategoryDropdown";
import EditBudgetModal from "./EditBudgetModal";
import axios from "axios";

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [formData, setFormData] = useState({ category: "", customCategory: "", amount: "" });
    const [error, setError] = useState("");
    const [selectedBudget, setSelectedBudget] = useState(null); // For editing

    useEffect(() => {
        const fetchBudgets = async () => {
            try {
                const response = await axios.get("/api/budgets", { withCredentials: true });
                setBudgets(response.data);
            } catch (err) {
                console.error("Failed to fetch budgets");
            }
        };

        fetchBudgets();
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

        try {
            const response = await axios.post(
                "/api/budgets",
                { ...formData, category: finalCategory },
                { withCredentials: true }
            );
            setBudgets([...budgets, response.data]);
            setFormData({ category: "", customCategory: "", amount: "" });
        } catch (err) {
            setError("Failed to add budget. Please try again.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/budgets/${id}`, { withCredentials: true });
            setBudgets((prev) => prev.filter((budget) => budget.id !== id));
        } catch (err) {
            console.error("Failed to delete budget.");
        }
    };

    const handleBudgetUpdated = (updatedBudget) => {
        setBudgets((prev) =>
            prev.map((budget) => (budget.id === updatedBudget.id ? updatedBudget : budget))
        );
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-6">Manage Budgets</h1>
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                {/* Category Dropdown */}
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
                {budgets.length === 0 ? (
                    <p className="text-sm text-gray-500">No budgets added yet.</p>
                ) : (
                    <ul>
                        {budgets.map((budget) => (
                            <li
                                key={budget.id}
                                className="flex justify-between items-center mb-2 border-b last:border-0 py-2"
                            >
                                <span>
                                    <strong>{budget.category}:</strong> ${budget.amount.toFixed(2)}
                                </span>
                                <div className="space-x-2">
                                    <button
                                        className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        onClick={() => setSelectedBudget(budget)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        onClick={() => handleDelete(budget.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
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
