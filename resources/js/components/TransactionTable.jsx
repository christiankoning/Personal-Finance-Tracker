import React, { useContext } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CurrencyContext } from "./CurrencyContext";

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
    const { selectedCurrency, currencyRates, currencySymbols } = useContext(CurrencyContext);

    // Helper functions
    const convertAmount = (amount, originalCurrency = "USD") => {
        if (!currencyRates[originalCurrency] || !currencyRates[selectedCurrency]) return amount;
        return (amount * currencyRates[selectedCurrency]) / currencyRates[originalCurrency];
    };

    const formatCurrency = (amount, currency) => {
        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${amount.toFixed(2)}`;
    };

    if (transactions.length === 0) {
        return <p className="text-gray-500">No transactions available. Add one to get started!</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                <tr className="bg-blue-600 text-white">
                    <th className="py-2 px-4 text-left">Date</th>
                    <th className="py-2 px-4 text-left">Type</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Amount</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                </tr>
                </thead>
                <tbody>
                {transactions.map((transaction) => {
                    const convertedAmount = convertAmount(transaction.amount, transaction.currency || "USD");
                    return (
                        <tr key={transaction.id} className="hover:bg-gray-100">
                            <td className="py-2 px-4">{transaction.transaction_date}</td>
                            <td className="py-2 px-4">
                                {transaction.type === "expense" ? (
                                    <span className="text-red-600">Expense</span>
                                ) : (
                                    <span className="text-green-600">Income</span>
                                )}
                            </td>
                            <td className="py-2 px-4">{transaction.category}</td>
                            <td className="py-2 px-4">
                                {/* Original amount with its currency symbol */}
                                {formatCurrency(transaction.amount, transaction.currency || "USD")}
                                {selectedCurrency !== transaction.currency && (
                                    <span className="text-gray-500 text-sm ml-2">
                                            {/* Converted amount with selected currency */}
                                        ({formatCurrency(convertedAmount, selectedCurrency)})
                                        </span>
                                )}
                            </td>
                            <td className="py-2 px-4">{transaction.description || "-"}</td>
                            <td
                                className="py-2 px-4 flex items-center space-x-2"
                                style={{ width: "100px", whiteSpace: "nowrap" }}
                            >
                                <button
                                    onClick={() => onEdit(transaction)}
                                    className="text-gray-800 hover:text-gray-600"
                                    title="Edit Transaction"
                                >
                                    <PencilSquareIcon className="h-5 w-5 inline" />
                                </button>
                                <button
                                    onClick={() => onDelete(transaction.id)}
                                    className="text-gray-800 hover:text-gray-600"
                                    title="Delete Transaction"
                                >
                                    <TrashIcon className="h-5 w-5 inline" />
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionTable;
