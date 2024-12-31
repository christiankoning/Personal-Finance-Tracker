import React from 'react';
import Footer from "./Footer";

const Home = () => {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            {/* Header Section */}
            <header className="p-6 flex justify-between items-center">
                <h1 className="text-3xl font-bold">FinanceTracker</h1>
                <nav className="space-x-4">
                    <a href="/register" className="hover:underline">
                        Register
                    </a>
                    <a href="/login" className="hover:underline">
                        Login
                    </a>
                </nav>
            </header>

            {/* Hero Section */}
            <div className="h-screen flex items-center justify-center text-center px-6">
                <div>
                    <h1 className="text-5xl font-extrabold leading-tight">
                        Take Control of Your Finances
                    </h1>
                    <p className="mt-4 text-lg text-white/90">
                        Manage your money, track your expenses, and build a better future—all in one place.
                    </p>
                    <div className="mt-6 flex justify-center space-x-4">
                        <a
                            href="/register"
                            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100"
                        >
                            Get Started
                        </a>
                        <a
                            href="/login"
                            className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100"
                        >
                            Login
                        </a>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section className="bg-white text-gray-800 py-16">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Why Choose FinanceTracker?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="p-6 text-center border rounded-lg shadow hover:shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Expense Tracking</h3>
                            <p className="text-gray-600">
                                Easily track your daily expenses with intuitive charts and summaries.
                            </p>
                        </div>
                        <div className="p-6 text-center border rounded-lg shadow hover:shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Budget Planning</h3>
                            <p className="text-gray-600">
                                Set monthly budgets and track your spending to stay on track.
                            </p>
                        </div>
                        <div className="p-6 text-center border rounded-lg shadow hover:shadow-lg">
                            <h3 className="text-xl font-bold mb-2">Financial Insights</h3>
                            <p className="text-gray-600">
                                Generate personalized insights to better understand your habits.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call-to-Action Section */}
            <section className="bg-white text-gray-800 py-16">
                <div className="max-w-6xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold mb-6">
                        Ready to Take Control?
                    </h2>
                    <p className="mb-6 text-lg">
                        Sign up today and start your journey towards financial freedom.
                    </p>
                    <a
                        href="/register"
                        className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-100"
                    >
                        Get Started Now
                    </a>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
