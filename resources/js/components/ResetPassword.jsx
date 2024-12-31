import React, { useState } from "react";
import axios from "axios";

const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setEmail(e.target.value);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email) {
            setError("Email is required.");
            return;
        }

        try {
            const response = await axios.post("/api/reset-password", { email });
            setMessage(response.data.message);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex items-center justify-center">
            {/* Reset Password Card */}
            <div className="bg-white text-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-6">Reset Your Password</h2>
                <p className="text-sm text-gray-600 text-center mb-4">
                    Enter your email address below and we’ll send you a link to reset your password.
                </p>
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
                            value={email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    {/* Success Message */}
                    {message && (
                        <p className="text-green-500 text-sm">{message}</p>
                    )}

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Send Reset Link
                        </button>
                    </div>
                </form>

                {/* Back to Login */}
                <p className="mt-4 text-center text-sm text-gray-600">
                    Remembered your password?{" "}
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

export default ResetPassword;
