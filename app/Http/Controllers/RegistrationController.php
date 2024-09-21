<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
class RegistrationController extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|unique:users,username',
                'usertype' => 'required|string',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422); // Unprocessable Entity
            }
    
            // Create the user if validation passes
            $user = User::create([
                'username' => $request->username,
                'usertype' => $request->usertype,
            ]);

            return response()->json(['message' => 'User registered successfully!'], 201);

        } catch (ValidationException $e) {
            // Return validation error messages
            return response()->json([
                'message' => 'Username was already taken',
                'errors' => $e->validator->errors(),
            ], 422);
        }
     
    }
}
