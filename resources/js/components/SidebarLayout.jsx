import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CurrencyContext } from "./CurrencyContext";
import CurrencyDropdown from "./CurrencyDropdown";

const SidebarLayout = ({ children }) => {
    const navigate = useNavigate();
    const { selectedCurrency, setSelectedCurrency } = useContext(CurrencyContext);

    const handleLogout = async () => {
        try {
            const response = await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                window.location.href = "/login";
            } else {
                alert(result.message || "Logout failed.");
            }
        } catch (error) {
            alert("Error logging out. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <aside className="w-64 bg-blue-600 text-white flex flex-col">
                <div className="p-4 text-center font-bold text-xl">FinanceTracker</div>
                <nav className="flex-1">
                    <ul>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => navigate("/dashboard")}>
                            Dashboard
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => navigate("/transactions")}>
                            Transactions
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => navigate("/budgets")}>
                            Budgeting
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => navigate("/goals")}>
                            Income Goals
                        </li>
                        <li className="p-4 hover:bg-blue-700 cursor-pointer" onClick={() => navigate("/insights")}>
                            Insights
                        </li>
                    </ul>
                </nav>
                <div className="m-4">
                    <CurrencyDropdown
                        selectedCurrency={selectedCurrency}
                        onCurrencyChange={setSelectedCurrency}
                    />
                </div>
                <button
                    onClick={handleLogout}
                    className="m-4 p-2 bg-red-600 rounded-lg hover:bg-red-700"
                >
                    Logout
                </button>
            </aside>
            <main className="flex-1 p-6 bg-gray-100 text-gray-800">{children}</main>
        </div>
    );
};

export default SidebarLayout;
