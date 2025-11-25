<?php

use App\Http\Controllers\API\AttachmentController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\UserAvatarController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    // --- MON COMPTE (SELF) ---
    // Update avatar
    Route::post('/me/avatar', [UserAvatarController::class, 'update']);

    // Update profile (Nom, Phone, etc.)
    Route::patch('/me/profile', function (Request $request) {
        return app(UserController::class)->update($request, $request->user());
    });

    // Delete account
    Route::delete('/me/account', function (Request $request) {
        return app(UserController::class)->destroy($request, $request->user());
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

    // Users
    // On ne garde que 'show' (voir un profil public).
    // Update, Destroy, Store et Index sont masqués ici (réservés aux futurs Admins via /api/users/{id})
    Route::apiResource('users', UserController::class)
        ->only(['show']);
});
