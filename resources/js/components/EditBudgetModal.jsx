import React, { useState } from "react";
import axios from "axios";
import CategoryDropdown from "./CategoryDropdown";

const EditBudgetModal = ({ budget, onClose, onBudgetUpdated }) => {
    const [formData, setFormData] = useState({
        category: budget.category,
        customCategory: budget.category === "Other" ? budget.customCategory : "",
        amount: budget.amount,
    });
    const [error, setError] = useState("");

    const handleCategoryChange = ({ category, customCategory }) => {
        setFormData({ ...formData, category, customCategory });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
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
            const response = await axios.put(
                `/api/budgets/${budget.id}`,
                { ...formData, category: finalCategory },
                { withCredentials: true }
            );
            onBudgetUpdated(response.data);
            onClose();
        } catch (err) {
            setError("Failed to update budget. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Edit Budget</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Category Dropdown */}
                    <CategoryDropdown
                        category={formData.category}
                        customCategory={formData.customCategory}
                        onCategoryChange={handleCategoryChange}
                        filterType="expense" // Only show expense categories
                        showCustomType={false} // Disable radio buttons for custom categories
                    />

                    {/* Amount Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Amount</label>
                        <input
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}

                    {/* Buttons */}
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditBudgetModal;
