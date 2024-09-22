<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Account;

use App\Http\Middleware\Token;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::post('/register', [Account::class, 'register']);
Route::post('/login', [Account::class, 'login'])->name('login')->middleware('throttle:5,1');




// Authenticated routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/tokens/create', function (Request $request) {
        $token = $request->user()->createToken('Token Name');
        return ['token' => $token->plainTextToken];
    });

    Route::middleware([Token::class])->group(function () {
        Route::get('/protected-route', function () {
            return response()->json(['message' => 'You have access!']);
        });
    });
});