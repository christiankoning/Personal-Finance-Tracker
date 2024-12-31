<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('app'); // Render the React app for the homepage
});

Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');


