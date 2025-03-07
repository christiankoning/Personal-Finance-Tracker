# 💰 Personal Finance Tracker
A powerful and user-friendly web application to manage your personal finances efficiently.
Track income and expenses, set category-specific budgets, gain financial insights through interactive charts, 
and manage multiple currencies with real-time exchange rates.


## Features

### User Authentication
- Secure registration and login system.
- Password hashing for enhanced security.
- Session-based authentication.

### Transaction Management
- Add, edit, and delete income and expenses.
- Categorize transactions (e.g., Salary, Rent, Groceries, Entertainment).
- Multi-currency support with real-time exchange rates.

### Budgeting & Goals
- Set category-specific budgets with overspending alerts.
- Define and track income goals with progress indicators.
- Currency-aware budget tracking.

### Financial Insights & Analytics
- Interactive bar, line, and doughnut charts to visualize spending trends.
- Monthly summaries to track financial habits.
- Budget adherence insights.

### Multi-Currency Support
- Convert transactions and budgets into your preferred currency.
- Real-time exchange rates for accurate financial tracking.

## Tech Stack
- **Frontend:** React, Chart.js, Tailwind CSS.
- **Backend:** Laravel, PHP, MySQL.
- **Authentication:** Laravel Passport.
- **Currency API:** ExchangeRate-API.

## Installation & Setup

### 1. Install Dependencies
In the repository use `composer install` and `npm install` to install all the dependencies.

### 2. Set up environment
Copy `.env.example` to `.env` (if not already set up).

### 3. Run database migrations & seeders
In the terminal use `php artisan migrate --seed`.

### 4. Build frontend assets
`npm run dev`

### 5. Start the application
`php artisan serve`

## API Endpoints
| Endpoint                  | Method | Description                          |
|---------------------------|--------|--------------------------------------|
| `/api/auth/register`      | POST   | Register a new user                 |
| `/api/auth/login`         | POST   | Log in and receive a token          |
| `/api/transactions`       | GET    | Fetch all transactions              |
| `/api/budgets`            | GET    | Fetch all user budgets              |
| `/api/currency/rates`     | GET    | Get real-time exchange rates        |
