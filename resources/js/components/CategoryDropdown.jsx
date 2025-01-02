import React from "react";

const standardCategories = [
    "Salary",
    "Freelance",
    "Groceries",
    "Rent",
    "Utilities",
    "Entertainment",
    "Transport",
];

const CategoryDropdown = ({ category, customCategory, onCategoryChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        if (value === "Other") {
            onCategoryChange({ category: value, customCategory: "" });
        } else {
            onCategoryChange({ category: value, customCategory: null });
        }
    };

    return (
        <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
            </label>
            <select
                id="category"
                name="category"
                value={category}
                onChange={handleChange}
                className="w-full mt-1 px-4 py-2 border rounded-lg"
            >
                <option value="">Select a category</option>
                {standardCategories.map((cat) => (
                    <option key={cat} value={cat}>
                        {cat}
                    </option>
                ))}
                <option value="Other">Other</option>
            </select>
            {category === "Other" && (
                <div className="mt-2">
                    <label
                        htmlFor="customCategory"
                        className="block text-sm font-medium text-gray-700"
                    >
                        Custom Category
                    </label>
                    <input
                        type="text"
                        id="customCategory"
                        name="customCategory"
                        value={customCategory || ""}
                        onChange={(e) =>
                            onCategoryChange({ category: "Other", customCategory: e.target.value })
                        }
                        className="w-full mt-1 px-4 py-2 border rounded-lg"
                        placeholder="Enter custom category"
                    />
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
