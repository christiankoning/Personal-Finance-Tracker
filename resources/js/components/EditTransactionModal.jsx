import React, { useState } from "react";
import axios from "axios";

const EditTransactionModal = ({ transaction, onClose, onTransactionUpdated }) => {
    const [formData, setFormData] = useState(transaction);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `/api/transactions/${transaction.id}`,
                formData,
                { withCredentials: true }
            );
            onTransactionUpdated(response.data);
            onClose();
        } catch (err) {
            setError("Failed to update transaction. Please try again.");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-lg font-bold mb-4">Edit Transaction</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                            Type
                        </label>
                        <div className="flex space-x-4 mt-1">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="expense"
                                    checked={formData.type === "expense"}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Expense
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="type"
                                    value="income"
                                    checked={formData.type === "income"}
                                    onChange={handleChange}
                                    className="mr-2"
                                />
                                Income
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                            Category
                        </label>
                        <input
                            type="text"
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full mt-1 px-4 py-2 border rounded-lg"
                            required
                        />
                    </div>
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionModal;
