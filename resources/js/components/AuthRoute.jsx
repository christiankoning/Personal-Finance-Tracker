import { Navigate } from "react-router-dom";
import axios from "axios";
import React, { useEffect, useState } from "react";

// Higher-Order Component to Protect Routes
const AuthRoute = ({ children, redirectTo }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Check user authentication
                await axios.get("/api/user", { withCredentials: true });
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>; // Show a loading state while checking
    }

    return isAuthenticated ? children : <Navigate to={redirectTo} />;
};

// Public Route Wrapper to Redirect Logged-In Users
const PublicRoute = ({ children, redirectTo }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get("/api/user", { withCredentials: true });
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <div>Loading...</div>;
    }

    return isAuthenticated ? <Navigate to={redirectTo} /> : children;
};

export { AuthRoute, PublicRoute };
