import React, { useState, useEffect, useContext } from "react";
import SidebarLayout from "./SidebarLayout";
import CategoryDropdown from "./CategoryDropdown";
import { CurrencyContext } from "./CurrencyContext";
import axios from "axios";
import Select from "react-select";

const IncomeGoals = () => {
    const { selectedCurrency, currencyRates, currencySymbols } = useContext(CurrencyContext);
    const [goals, setGoals] = useState([]);
    const [formData, setFormData] = useState({
        category: "",
        customCategory: "",
        amount: "",
        deadline: "",
        currency: selectedCurrency, // Default to the selected currency
    });
    const [editingGoal, setEditingGoal] = useState(null);
    const [error, setError] = useState("");

    const convertAmount = (amount, fromCurrency, toCurrency) => {
        if (!currencyRates[fromCurrency] || !currencyRates[toCurrency]) return amount;
        return (amount / currencyRates[fromCurrency]) * currencyRates[toCurrency];
    };

    const formatCurrency = (amount, currency) => {
        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${amount.toFixed(2)}`;
    };

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

    useEffect(() => {
        // Dynamically update the modal currency when the sidebar's selected currency changes
        setFormData((prevFormData) => ({
            ...prevFormData,
            currency: editingGoal ? prevFormData.currency : selectedCurrency,
        }));
    }, [selectedCurrency]);

    const handleCurrencyChange = (selectedOption) => {
        setFormData({ ...formData, currency: selectedOption.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const updatedFormData = {
                ...formData,
                amount: parseFloat(formData.amount),
            };

            if (editingGoal) {
                const response = await axios.put(`/api/goals/${editingGoal.id}`, updatedFormData, { withCredentials: true });
                setGoals((prev) =>
                    prev.map((goal) => (goal.id === editingGoal.id ? response.data : goal))
                );
                setEditingGoal(null);
            } else {
                const response = await axios.post("/api/goals", updatedFormData, { withCredentials: true });
                setGoals((prev) => [...prev, response.data]);
            }

            setFormData({ category: "", customCategory: "", amount: "", deadline: "", currency: selectedCurrency });
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
            currency: goal.currency, // Use goal's original currency
        });
    };

    const currencyOptions = Object.entries(currencySymbols).map(([code, symbol]) => ({
        value: code,
        label: (
            <span>
                <strong>{code}</strong> <span style={{ color: "grey" }}>| {symbol}</span>
            </span>
        ),
    }));

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
                    <label className="block text-sm font-medium text-gray-700">Currency</label>
                    <Select
                        value={currencyOptions.find((option) => option.value === formData.currency)}
                        options={currencyOptions}
                        onChange={handleCurrencyChange}
                        isDisabled={!!editingGoal} // Disable currency input for existing goals
                        styles={{
                            control: (provided) => ({
                                ...provided,
                                border: "1px solid #d1d5db",
                                borderRadius: "0.375rem",
                                padding: "0.25rem",
                            }),
                            option: (provided, state) => ({
                                ...provided,
                                backgroundColor: state.isFocused ? "#f9fafb" : "white",
                                color: state.isSelected ? "#1f2937" : "#4b5563",
                            }),
                        }}
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
                                setFormData({ category: "", customCategory: "", amount: "", deadline: "", currency: selectedCurrency });
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
                    goals.map(({ id, category, amount, progress, deadline, currency }) => {
                        const convertedProgress = convertAmount(progress, currency, selectedCurrency);
                        const convertedAmount = convertAmount(amount, currency, selectedCurrency);
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
                                            Target:{" "}
                                            {formatCurrency(progress, currency)}{" "}
                                            {selectedCurrency !== currency && (
                                                <span className="text-gray-500">
                                                    ({formatCurrency(convertedProgress, selectedCurrency)})
                                                </span>
                                            )}{" "}
                                            - {formatCurrency(amount, currency)}{" "}
                                            {selectedCurrency !== currency && (
                                                <span className="text-gray-500">
                                                    ({formatCurrency(convertedAmount, selectedCurrency)})
                                                </span>
                                            )}
                                            {deadline && ` by ${new Date(deadline).toLocaleDateString()}`}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit({ id, category, amount, progress, deadline, currency })}
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
