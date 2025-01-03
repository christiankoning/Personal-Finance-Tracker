import React, { useState, useEffect } from "react";
import SidebarLayout from "./SidebarLayout";
import CategoryDropdown from "./CategoryDropdown";
import axios from "axios";

const IncomeGoals = () => {
    const [goals, setGoals] = useState([]);
    const [formData, setFormData] = useState({ category: "", customCategory: "", amount: "", deadline: "" });
    const [editingGoal, setEditingGoal] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const response = await axios.get("/api/goals", { withCredentials: true });
                setGoals(response.data);
            } catch (err) {
                setError("Failed to fetch income goals. Please try again later.");
            }
        };

        fetchGoals();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingGoal) {
                const response = await axios.put(`/api/goals/${editingGoal.id}`, formData, { withCredentials: true });
                setGoals((prev) =>
                    prev.map((goal) => (goal.id === editingGoal.id ? response.data : goal))
                );
                setEditingGoal(null);
            } else {
                const response = await axios.post("/api/goals", formData, { withCredentials: true });
                setGoals((prev) => [...prev, response.data]);
            }

            setFormData({ category: "", customCategory: "", amount: "", deadline: "" });
        } catch (err) {
            setError("Failed to save income goal.");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/goals/${id}`, { withCredentials: true });
            setGoals((prev) => prev.filter((goal) => goal.id !== id));
        } catch (err) {
            console.error("Failed to delete income goal.");
        }
    };

    const handleEdit = (goal) => {
        setEditingGoal(goal);
        setFormData({
            category: goal.category,
            customCategory: goal.category === "Other" ? goal.customCategory : "",
            amount: goal.amount,
            deadline: goal.deadline || "",
        });
    };

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-6">Your Income Goals</h1>

            {/* Add/Edit Goal Form */}
            <form onSubmit={handleSubmit} className="mb-6 p-4 bg-white rounded-lg shadow">
                <CategoryDropdown
                    category={formData.category}
                    customCategory={formData.customCategory}
                    onCategoryChange={({ category, customCategory }) =>
                        setFormData({ ...formData, category, customCategory })
                    }
                    filterType="income"
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
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Deadline (Optional)</label>
                    <input
                        type="date"
                        name="deadline"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                </div>
                <div className="flex justify-end space-x-2">
                    {editingGoal && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingGoal(null);
                                setFormData({ category: "", customCategory: "", amount: "", deadline: "" });
                            }}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className={`px-4 py-2 ${
                            editingGoal ? "bg-yellow-500 hover:bg-yellow-600" : "bg-blue-600 hover:bg-blue-700"
                        } text-white rounded`}
                    >
                        {editingGoal ? "Save Changes" : "Add Goal"}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>

            {/* Income Goals List */}
            <ul className="bg-white rounded-lg shadow p-4">
                {goals.length === 0 ? (
                    <p className="text-sm text-gray-500">No income goals set.</p>
                ) : (
                    goals.map(({ id, category, amount, progress, deadline }) => {
                        const percentage = Math.min((progress / amount) * 100, 100);
                        const barColor =
                            percentage < 75
                                ? "bg-green-500"
                                : percentage < 100
                                    ? "bg-yellow-500"
                                    : "bg-blue-500";

                        return (
                            <li key={id} className="mb-4 border-b last:border-0 py-2">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium">{category}</p>
                                        <p className="text-sm text-gray-500">
                                            Target: ${progress.toFixed(2)} / ${amount.toFixed(2)}{" "}
                                            {deadline && `by ${new Date(deadline).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit({ id, category, amount, progress, deadline })}
                                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(id)}
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
                            </li>
                        );
                    })
                )}
            </ul>
        </SidebarLayout>
    );
};

export default IncomeGoals;
