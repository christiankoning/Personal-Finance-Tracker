<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app'); // Render the React app for the homepage
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

Route::get('/set-new-password/{token}', function ($token) {
    return view('app', ['token' => $token]);
})->name('password.reset');


