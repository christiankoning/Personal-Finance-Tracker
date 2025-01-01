import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";

const Register = () => {
    const navigate = useNavigate(); // Initialize useNavigate
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear errors when typing
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page refresh

        // Validate passwords
        if (!formData.password || !formData.confirmPassword) {
            setError("Both password fields are required.");
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            // Send data to the backend
            const response = await axios.post("/api/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            // Show success message
            setSuccess("Registration successful! Redirecting to login...");
            setError("");

            // Clear the form
            setFormData({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
            });

            // Redirect to Login after 2 seconds
            setTimeout(() => {
                navigate("/login");
            }, 1000);
        } catch (err) {
            // Handle backend errors
            setError(err.response?.data?.message || "Something went wrong.");
            setSuccess("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
            {/* Registration Card */}
            <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Create an Account</h2>
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Name Field */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your name"
                            required
                        />
                    </div>

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
                            placeholder="Create a password"
                            required
                        />
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password"
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
                            Register
                        </button>
                    </div>
                </form>

                {/* Back to Homepage Button */}
                <div className="mt-4 text-center">
                    <a
                        href="/"
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                        Back to Homepage
                    </a>
                </div>

                {/* Already have an account? */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a
                        href="/login"
                        className="text-blue-600 hover:underline"
                    >
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
