<?php

namespace App\Http\Controllers;

use Google\Client as GoogleClient;
use Illuminate\Http\Request;
use App\Models\User; // Make sure to include your User model

class GoogleAuth extends Controller
{
    public function googleSignIn(Request $request) // Define a method
    {
        $idToken = $request->input('idToken');

        // Verify the ID token with Google
        $client = new GoogleClient(['client_id' => env('GOOGLE_CLIENT_ID')]);
        $payload = $client->verifyIdToken($idToken);

        if ($payload) {
            $userId = $payload['sub'];
            $user = User::firstOrCreate(
                ['google_id' => $userId],
                ['name' => $payload['name'], 'email' => $payload['email']]
            );

            $token = $user->createToken('Google SignIn')->plainTextToken;

            return response()->json(['token' => $token, 'user' => $user]);
        } else {
            return response()->json(['error' => 'Invalid ID token'], 401);
        }
    }
}
