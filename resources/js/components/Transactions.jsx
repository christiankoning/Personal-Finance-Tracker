import React, { useEffect, useState, useContext } from "react";
import SidebarLayout from "./SidebarLayout";
import TransactionTable from "./TransactionTable";
import AddTransactionModal from "./AddTransactionModal";
import EditTransactionModal from "./EditTransactionModal";
import axios from "axios";
import { CurrencyContext } from "./CurrencyContext";

const Transactions = () => {
    const { selectedCurrency, currencyRates, currencySymbols } = useContext(CurrencyContext);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await axios.get("/api/transactions", { withCredentials: true });
                setTransactions(response.data);
            } catch (err) {
                setError("Failed to load transactions. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    if (loading) {
        return <p>Loading transactions...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <SidebarLayout>
            <h1 className="text-3xl font-bold mb-6">Transactions</h1>
            <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 mb-4"
            >
                Add Transaction
            </button>
            <TransactionTable
                transactions={transactions}
                onEdit={(transaction) => {
                    setSelectedTransaction(transaction);
                    setShowEditModal(true);
                }}
                onDelete={async (id) => {
                    try {
                        await axios.delete(`/api/transactions/${id}`, { withCredentials: true });
                        setTransactions((prev) => prev.filter((t) => t.id !== id));
                    } catch {
                        alert("Failed to delete transaction.");
                    }
                }}
                selectedCurrency={selectedCurrency}
                currencyRates={currencyRates}
                currencySymbols={currencySymbols}
            />
            {showAddModal && (
                <AddTransactionModal
                    onClose={() => setShowAddModal(false)}
                    onTransactionAdded={(newTransaction) => {
                        setTransactions((prev) =>
                            [...prev, newTransaction].sort(
                                (a, b) => new Date(b.transaction_date) - new Date(a.transaction_date)
                            )
                        );
                    }}
                />
            )}
            {showEditModal && selectedTransaction && (
                <EditTransactionModal
                    transaction={selectedTransaction}
                    onClose={() => setShowEditModal(false)}
                    onTransactionUpdated={(updatedTransaction) => {
                        setTransactions((prev) =>
                            prev.map((t) =>
                                t.id === updatedTransaction.id ? updatedTransaction : t
                            )
                        );
                    }}
                />
            )}
        </SidebarLayout>
    );
};

export default Transactions;
