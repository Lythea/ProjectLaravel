<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Carbon\Carbon;
class Token
{
    const TOKEN_EXPIRATION_MINUTES = 60; // Define expiration time

    public function handle(Request $request, Closure $next)
    {
        $user = $request->user();

        if ($user) {
            $tokenId = $request->bearerToken()->id;

            // Get the token's creation time
            $token = $user->tokens()->where('id', $tokenId)->first();

            if ($token) {
                $tokenCreatedAt = $token->created_at;

                // Check if the token has expired
                if ($tokenCreatedAt->diffInMinutes(Carbon::now()) > self::TOKEN_EXPIRATION_MINUTES) {
                    return response()->json(['message' => 'Token has expired'], 401);
                }
            }
        }

        return $next($request);
    }
}