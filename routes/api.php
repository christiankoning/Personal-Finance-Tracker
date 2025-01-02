<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\BudgetController;

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
});
