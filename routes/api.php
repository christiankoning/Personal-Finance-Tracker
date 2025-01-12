<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\GoalController;
use App\Http\Controllers\InsightController;
use App\Http\Controllers\CurrencyController;

Route::post('/register', [AuthController::class, 'register']);
Route::middleware('web')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');
    Route::get('/user', function () {
        return auth()->user() ? response()->json(auth()->user()) : response()->json(null, 401);
    })->middleware('auth');
    Route::post('/reset-password', [AuthController::class, 'sendPasswordResetLink']);
    Route::post('/reset-password/confirm', [AuthController::class, 'resetPassword']);
});
Route::middleware(['auth', 'web'])->group(function () {
    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::post('/transactions', [TransactionController::class, 'store']);
    Route::put('/transactions/{id}', [TransactionController::class, 'update']);
    Route::delete('/transactions/{id}', [TransactionController::class, 'destroy']);
    Route::get('/transactions/recent', [TransactionController::class, 'recent']);
    Route::get('/budgets', [BudgetController::class, 'index']);
    Route::post('/budgets', [BudgetController::class, 'store']);
    Route::put('/budgets/{id}', [BudgetController::class, 'update']);
    Route::delete('/budgets/{id}', [BudgetController::class, 'destroy']);
    Route::get('/budgets/spending', [BudgetController::class, 'getSpending']);
    Route::get('/goals', [GoalController::class, 'index']);
    Route::post('/goals', [GoalController::class, 'store']);
    Route::put('/goals/{id}', [GoalController::class, 'update']);
    Route::delete('/goals/{id}', [GoalController::class, 'destroy']);
    Route::get('/insights/spending-trends', [InsightController::class, 'spendingTrends']);
    Route::get('/insights/income-trends', [InsightController::class, 'incomeTrends']);
    Route::get('/insights/budget-adherence', [InsightController::class, 'budgetAdherence']);
    Route::get('/currency/rates', [CurrencyController::class, 'getRates']);
    Route::get('/currency/symbols', [CurrencyController::class, 'getSymbols']);
});
