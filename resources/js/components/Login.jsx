import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import axios from "axios";

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear the error when the user starts typing
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.email || !formData.password) {
            setError("All fields are required.");
            return;
        }

        try {
            // Send login request to backend
            const response = await axios.post("/api/login", formData);

            // Redirect to the dashboard on successful login
            navigate("/dashboard");
        } catch (err) {
            // Handle login errors
            setError(err.response?.data?.message || "Login failed. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
            {/* Login Card */}
            <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>
                </form>

                {/* Forgot Password and Register Link */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    <p>
                        Forgot your password?{" "}
                        <a
                            href="/reset-password"
                            className="text-blue-600 hover:underline"
                        >
                            Reset it here
                        </a>
                    </p>
                    <p className="mt-2">
                        Don't have an account?{" "}
                        <a
                            href="/register"
                            className="text-blue-600 hover:underline"
                        >
                            Register
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
