import React, { useEffect, useState } from "react";
import SidebarLayout from "./SidebarLayout";
import TransactionTable from "./TransactionTable";
import AddTransactionModal from "./AddTransactionModal";
import EditTransactionModal from "./EditTransactionModal";
import axios from "axios";

const Transactions = () => {
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

    const handleTransactionAdded = (newTransaction) => {
        setTransactions((prev) => [...prev, newTransaction]);
    };

    const handleTransactionUpdated = (updatedTransaction) => {
        setTransactions((prev) =>
            prev.map((transaction) =>
                transaction.id === updatedTransaction.id ? updatedTransaction : transaction
            )
        );
    };

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setShowEditModal(true);
    };

    const handleDelete = async (transactionId) => {
        try {
            await axios.delete(`/api/transactions/${transactionId}`, { withCredentials: true });
            setTransactions((prev) =>
                prev.filter((transaction) => transaction.id !== transactionId)
            );
            alert("Transaction deleted successfully.");
        } catch (err) {
            alert("Failed to delete transaction. Please try again.");
        }
    };

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
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
            {showAddModal && (
                <AddTransactionModal
                    onClose={() => setShowAddModal(false)}
                    onTransactionAdded={handleTransactionAdded}
                />
            )}
            {showEditModal && selectedTransaction && (
                <EditTransactionModal
                    transaction={selectedTransaction}
                    onClose={() => setShowEditModal(false)}
                    onTransactionUpdated={handleTransactionUpdated}
                />
            )}
        </SidebarLayout>
    );
};

export default Transactions;
