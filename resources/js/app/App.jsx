import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../components/Home';
import Register from '../components/Register';
import Login from '../components/Login';
import Dashboard from '../components/Dashboard';
import ResetPassword from "../components/ResetPassword";
import SetNewPassword from "../components/SetNewPassword";

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/set-new-password" element={<SetNewPassword />} />
            </Routes>
        </Router>
    );
};

export default App;
