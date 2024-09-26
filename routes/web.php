<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegistrationController;
use Illuminate\Http\Request; // Import the Request class
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;

Route::get('/', function () {
    return view('home');
});
Route::get('/dashboard', function () {
    return view('dashboard');
});
Route::get('/nightcrows', function () {
    return view('nightcrows');
});
Route::get('/toram', function () {
    return view('toram');
});















Route::get('/auth/google/redirect', function (Request $request) {
    return Socialite::driver("google")->redirect();
});
Route::get('/auth/google/callback', function(Request $request) {
    $googleUser = Socialite::driver("google")->user();

    // Check if the Google ID is available
    if (!$googleUser->id) {
        return response()->json(['error' => 'Unable to retrieve Google ID.'], 400);
    }

    // Check if the user already exists
    $user = User::where('username', $googleUser->email)->first();

    if ($user) {
        // User exists, log them in
        Auth::login($user);
        return redirect('/dashboard');
    } else {
        // User does not exist, create a new record
        $user = User::create([
            'g_id' => $googleUser->id,  // Use Google ID as a unique identifier
            'username' => $googleUser->email,
            'usertype' => 'email',
            'password' => Hash::make(Str::random(12)), // Hash a random password
            'email_verified_at' => now()
        ]);

        // Log the newly created user in
        Auth::login($user);
        return redirect('/dashboard');
    }
});

