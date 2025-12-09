<?php

use App\Http\Controllers\API\AssetController;
use App\Http\Controllers\API\AttachmentController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\RoleController;
use App\Http\Controllers\API\UserController;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;

// =========================================
// PUBLIC ROUTES
// =========================================

Route::post('/auth/login', [AuthController::class, 'login']);

// =========================================
// PROTECTED ROUTES
// =========================================

Route::middleware('auth:sanctum')->group(function () {

    // --- AUTHENTICATION ---
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // --- MON COMPTE (SELF) ---
    Route::prefix('me')->controller(ProfileController::class)->group(function () {
        Route::get('/', 'show');                  // GET /api/me
        Route::patch('/profile', 'update');       // PATCH /api/me/profile
        Route::put('/password', 'updatePassword');// PUT /api/me/password
        Route::delete('/account', 'destroy');     // DELETE /api/me/account
        Route::post('/avatar', 'updateAvatar'); // POST /api/me/avatar
    });

    // --- ADMINISTRATION UTILISATEURS ---
    Route::apiResource('users', UserController::class, ['as' => 'api']);
    // --- GESTION DES ASSETS ---
    Route::apiResource('assets', AssetController::class, ['as' => 'api']);
    // --- GESTION DES ATTACHMENTS ---
    Route::apiResource('attachments', AttachmentController::class, ['as' => 'api'])->only(['destroy']);
    // --- GESTION DES ROLES ---
    Route::apiResource('roles', RoleController::class, ['as' => 'api']);
});
