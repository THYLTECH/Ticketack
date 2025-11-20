<?php

use App\Http\Controllers\API\AttachmentController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

Route::get('/users', [UserController::class, 'index']);
Route::get('/attachments', [AttachmentController::class, 'index']);

Route::post('/login', function (Request $request) {
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    $user = $request->user();

    return [
        'token' => $user->createToken('api-token')->plainTextToken,
        'user' => $user
    ];
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', function (Request $request) {
        return $request->user();
    });
    Route::get('/attachments', [AttachmentController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/logout', function (Request $request) {
        $token = $request->user()?->currentAccessToken();

        if (!$token) {
            return response()->json([
                'message' => 'Already logged out'
            ], 401);
        }

        $token->delete();

        return [
            'message' => 'Logged out successfully'
        ];
    });
});


