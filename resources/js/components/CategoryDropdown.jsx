import React from "react";

const standardCategories = [
    {name: "Salary", type: "income"},
    {name: "Freelance", type: "income"},
    {name: "Groceries", type: "expense"},
    {name: "Rent", type: "expense"},
    {name: "Utilities", type: "expense"},
    {name: "Entertainment", type: "expense"},
    {name: "Transport", type: "expense"},
];

const expenseCategories = standardCategories.filter((cat) => cat.type === "expense");

const CategoryDropdown = ({
                              category,
                              customCategory,
                              onCategoryChange,
                              filterType = "all", // Options: 'income', 'expense', 'all'
                              customType,
                              onCustomTypeChange,
                              showCustomType = true, // Whether to show radio buttons for custom types
                          }) => {
    const filteredCategories = standardCategories.filter(
        (cat) => filterType === "all" || cat.type === filterType
    );

    const handleChange = (e) => {
        const { value } = e.target;
        if (value === "Other") {
            onCategoryChange({ category: value, customCategory: "", customType: "expense" });
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
                {filteredCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>
                        {cat.name}
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
                    {showCustomType && (
                        <div className="flex mt-2">
                            <label className="flex items-center mr-4">
                                <input
                                    type="radio"
                                    name="customType"
                                    value="expense"
                                    checked={customType === "expense"}
                                    onChange={(e) => onCustomTypeChange(e.target.value)}
                                    className="mr-2"
                                />
                                Expense
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="customType"
                                    value="income"
                                    checked={customType === "income"}
                                    onChange={(e) => onCustomTypeChange(e.target.value)}
                                    className="mr-2"
                                />
                                Income
                            </label>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CategoryDropdown;
