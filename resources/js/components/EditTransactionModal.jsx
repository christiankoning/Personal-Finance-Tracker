import React, { useState, useContext } from "react";
import axios from "axios";
import CategoryDropdown, { standardCategories } from "./CategoryDropdown";
import { CurrencyContext } from "./CurrencyContext";
import Select from "react-select";

const EditTransactionModal = ({ transaction, onClose, onTransactionUpdated }) => {
    const { currencySymbols } = useContext(CurrencyContext);
    const [formData, setFormData] = useState({
        category: transaction.category,
        customCategory: transaction.category === "Other" ? transaction.customCategory : "",
        amount: transaction.amount,
        transaction_date: transaction.transaction_date,
        description: transaction.description,
        type: transaction.type,
        currency: transaction.currency || "USD",
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
                `/api/transactions/${transaction.id}`,
                { ...formData, category: finalCategory },
                { withCredentials: true }
            );
            onTransactionUpdated(response.data);
            onClose();
        } catch (err) {
            setError("Failed to update transaction. Please try again.");
        }
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Category Dropdown */}
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

                    {/* Amount Field */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                            Amount
                        </label>
                        <input
                            type="number"
                            id="amount"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    {/* Currency Dropdown */}
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

                    {/* Date Field */}
                    <div>
                        <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        <input
                            type="date"
                            id="transaction_date"
                            name="transaction_date"
                            value={formData.transaction_date}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
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

export default EditTransactionModal;
