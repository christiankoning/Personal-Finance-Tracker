import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../components/Home";
import Register from "../components/Register";
import Login from "../components/Login";
import Dashboard from "../components/Dashboard";
import ResetPassword from "../components/ResetPassword";
import SetNewPassword from "../components/SetNewPassword";
import Transactions from "../components/Transactions";
import Budget from "../components/Budget";
import IncomeGoals from "../components/IncomeGoals";
import { AuthRoute, PublicRoute } from "../components/AuthRoute";

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/"
                    element={
                        <PublicRoute redirectTo="/dashboard">
                            <Home />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicRoute redirectTo="/dashboard">
                            <Register />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicRoute redirectTo="/dashboard">
                            <Login />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <PublicRoute redirectTo="/dashboard">
                            <ResetPassword />
                        </PublicRoute>
                    }
                />
                <Route
                    path="/set-new-password"
                    element={
                        <PublicRoute redirectTo="/dashboard">
                            <SetNewPassword />
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/dashboard"
                    element={
                        <AuthRoute redirectTo="/login">
                            <Dashboard />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/transactions"
                    element={
                        <AuthRoute redirectTo="/login">
                            <Transactions />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/budgets"
                    element={
                        <AuthRoute redirectTo="/login">
                            <Budget />
                        </AuthRoute>
                    }
                />
                <Route
                    path="/goals"
                    element={
                        <AuthRoute redirectTo="/login">
                            <IncomeGoals />
                        </AuthRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;
