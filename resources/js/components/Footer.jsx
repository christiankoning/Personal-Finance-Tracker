import React from "react";

const Footer = () => {
    return (
        <footer className="text-gray-400 py-6 text-center text-white">
            <p>&copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.</p>
        </footer>
    );
};

export default Footer;
