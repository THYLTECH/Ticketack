<?php

use App\Http\Controllers\API\AttachmentController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserAvatarController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

// =========================================
// PUBLIC ROUTES
// =========================================

Route::post('/auth/login', function (Request $request) {

    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    return [
        'token' => $request->user()->createToken('api-token')->plainTextToken,
        'user'  => $request->user()
    ];
});

// =========================================
// PROTECTED ROUTES
// =========================================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me', fn(Request $request) => $request->user());

    Route::post('/auth/logout', function (Request $request) {
        $token = $request->user()?->currentAccessToken();
        if (!$token) {
            return response()->json(['message' => 'Already logged out'], 401);
        }
        $token->delete();
        return ['message' => 'Logged out successfully'];
    });

    // Update avatar
    Route::post('/me/avatar', [UserAvatarController::class, 'update']);

    // Users
    Route::apiResource('users', UserController::class);

    // Attachments
    Route::apiResource('attachments', AttachmentController::class);
    Route::get('/attachments/{attachment}/download', [AttachmentController::class, 'download']);
    Route::patch('/attachments/{attachment}/metadata', [AttachmentController::class, 'updateMetadata']);
});
