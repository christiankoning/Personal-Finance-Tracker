<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;

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
