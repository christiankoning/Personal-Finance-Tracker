import React, { useState, useContext } from "react";
import axios from "axios";
import CategoryDropdown, { standardCategories } from "./CategoryDropdown";
import { CurrencyContext } from "./CurrencyContext";
import Select from "react-select";

const AddTransactionModal = ({ onClose, onTransactionAdded }) => {
    const { currencySymbols, selectedCurrency } = useContext(CurrencyContext);
    const [formData, setFormData] = useState({
        category: "",
        customCategory: "",
        amount: "",
        transaction_date: "",
        description: "",
        type: "expense",
        currency: selectedCurrency,
    });
    const [error, setError] = useState("");

    const handleCategoryChange = ({ category, customCategory, customType }) => {
        const selectedType =
            category === "Other"
                ? customType || "expense"
                : standardCategories.find((cat) => cat.name === category)?.type || "expense";

        setFormData({ ...formData, category, customCategory, type: selectedType });
    };

    const handleCurrencyChange = (selectedOption) => {
        setFormData({ ...formData, currency: selectedOption.value });
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
                "/api/transactions",
                { ...formData, category: finalCategory },
                { withCredentials: true }
            );
            onTransactionAdded(response.data);
            onClose();
        } catch (err) {
            setError("Failed to add transaction. Please try again.");
        }
    };

    // Prepare options for react-select
    const currencyOptions = Object.entries(currencySymbols).map(([code, symbol]) => ({
        value: code,
        label: (
            <span>
                <strong>{code}</strong> <span style={{ color: "grey" }}>| {symbol}</span>
            </span>
        ),
    }));

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Add Transaction</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <CategoryDropdown
                        category={formData.category}
                        customCategory={formData.customCategory}
                        onCategoryChange={handleCategoryChange}
                        filterType="all"
                        showCustomType={true}
                        customType={formData.type}
                        onCustomTypeChange={(customType) =>
                            setFormData({ ...formData, type: customType })
                        }
                    />
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={(e) =>
                                setFormData({ ...formData, [e.target.name]: e.target.value })
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                            Currency
                        </label>
                        <Select
                            id="currency"
                            value={currencyOptions.find((option) => option.value === formData.currency)}
                            options={currencyOptions}
                            onChange={handleCurrencyChange}
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    border: "1px solid #d1d5db", // Tailwind gray-300
                                    borderRadius: "0.375rem", // Tailwind rounded-lg
                                    padding: "0.25rem",
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isFocused ? "#f9fafb" : "white", // Light gray on hover
                                    color: state.isSelected ? "#1f2937" : "#4b5563", // Dark text
                                }),
                            }}
                        />
                    </div>
                    <div>
                        <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            id="transaction_date"
                            name="transaction_date"
                            value={formData.transaction_date}
                            onChange={(e) =>
                                setFormData({ ...formData, [e.target.name]: e.target.value })
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, [e.target.name]: e.target.value })
                            }
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                        />
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
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
                            Add Transaction
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddTransactionModal;
