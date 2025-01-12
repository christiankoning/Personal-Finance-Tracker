import React, { useEffect, useState } from "react";
import axios from "axios";

const CurrencyDropdown = ({ selectedCurrency, onCurrencyChange }) => {
    const [currencies, setCurrencies] = useState([]); // Currency codes
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCurrencyData = async () => {
            try {
                const ratesResponse = await axios.get("/api/currency/rates");
                if (!ratesResponse.data) {
                    throw new Error("No data received from rates endpoint");
                }

                setCurrencies(Object.keys(ratesResponse.data)); // Set currency codes
            } catch (err) {
                console.error("Error fetching currency rates:", err);
                setError("Failed to fetch currencies.");
            }
        };

        fetchCurrencyData();
    }, []);

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300">Select Currency</label>
            <select
                value={selectedCurrency}
                onChange={(e) => onCurrencyChange(e.target.value)}
                className="w-full px-3 py-2 text-gray-800 rounded-md"
            >
                {error && <option disabled>{error}</option>}
                {!error &&
                currencies.map((currency) => (
                    <option key={currency} value={currency}>
                        {currency} {/* Only show the currency code */}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default CurrencyDropdown;
