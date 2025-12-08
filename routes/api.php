<?php

use App\Http\Controllers\API\AssetController;
use App\Http\Controllers\API\AttachmentController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserAvatarController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rules\Password;

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

    $user = $request->user();

    return [
        'token' => $user->createToken('api-token')->plainTextToken,
        'user'  => $user->load('roles', 'permissions'),
    ];
});

// =========================================
// PROTECTED ROUTES
// =========================================

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/auth/me', fn(Request $request) => $request->user()->load('roles', 'permissions'));

    Route::post('/auth/logout', function (Request $request) {
        $token = $request->user()?->currentAccessToken();
        if (!$token) {
            return response()->json(['message' => 'Already logged out'], 401);
        }
        $token->delete();
        return ['message' => 'Logged out successfully'];
    });

    // --- MON COMPTE (SELF) ---
    // Update avatar
    Route::post('/me/avatar', [UserAvatarController::class, 'update']);

    // Update profile (Nom, Phone, etc.)
    Route::patch('/me/profile', function (Request $request) {
        return app(UserController::class)->update($request, $request->user());
    });

    // Delete account
    Route::delete('/me/account', function (Request $request) {
        return app(UserController::class)->destroy($request->user());
    });

    // Update password
    Route::put('/me/password', function (Request $request) {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Password updated successfully']);
    });

    // --- ADMINISTRATION UTILISATEURS ---
    Route::apiResource('users', UserController::class, ['as' => 'api']);
    // --- GESTION DES ASSETS ---
    Route::apiResource('assets', AssetController::class, ['as' => 'api']);

    // --- GESTION DES ATTACHMENTS ---
    Route::apiResource('attachments', AttachmentController::class, ['as' => 'api'])->only(['destroy']);
});
