<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class Account extends Controller
{
    public function register(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'username' => 'required|string|unique:users,username',
                'password' => 'required|string',
                'usertype' => 'required|string',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'errors' => $validator->errors()
                ], 422); // Unprocessable Entity
            }
    
            $user = User::create([
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'usertype' => $request->usertype,
            ]);
    
            return response()->json(['message' => 'User registered successfully!'], 201);
    
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Username was already taken',
                'errors' => $e->validator->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred during registration',
                'error' => $e->getMessage(),
            ], 500); // Internal Server Error
        }
    }
    
    public function login(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422); // Unprocessable Entity
        }

        if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('Token Name')->plainTextToken; // Corrected

            return response()->json(['message' => 'Login successful!', 'token' => $token], 200);
        } else {
            return response()->json(['message' => 'Invalid username or password'], 401);
        }

    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred during login',
            'error' => $e->getMessage(),
        ], 500); // Internal Server Error
    }
}

}