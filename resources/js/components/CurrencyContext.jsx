import React, { createContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        const storedCurrency = localStorage.getItem("preferredCurrency");
        return storedCurrency || "USD";
    });
    const [currencyRates, setCurrencyRates] = useState({});
    const [currencySymbols, setCurrencySymbols] = useState({});

    useEffect(() => {
        const fetchCurrencyData = async () => {
            try {
                const ratesResponse = await fetch("/api/currency/rates");
                const symbolsResponse = await fetch("/api/currency/symbols");
                const rates = await ratesResponse.json();
                const symbols = await symbolsResponse.json();
                setCurrencyRates(rates);
                setCurrencySymbols(symbols);
            } catch (error) {
                console.error("Failed to fetch currency data:", error);
            }
        };
        fetchCurrencyData();
    }, []);

    useEffect(() => {
        localStorage.setItem("preferredCurrency", selectedCurrency);
    }, [selectedCurrency]);

    return (
        <CurrencyContext.Provider
            value={{
                selectedCurrency,
                setSelectedCurrency,
                currencyRates,
                currencySymbols,
            }}
        >
            {children}
        </CurrencyContext.Provider>
    );
};
