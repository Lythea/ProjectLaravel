<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;


Route::get('/dashboard', function () {
    return view('dashboard');
});
Route::get('/', function () {
    return view('home');
});
