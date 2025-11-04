<?php

// routes/auth.php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Auth\Login as ControllersLogin;
use App\Http\Controllers\Auth\Register as ControllersRegister;
use App\Http\Controllers\Auth\Password as ControllersPassword;
use App\Http\Controllers\Auth\EmailVerification as ControllersEmail;

Route::prefix('auth/')->name('auth.')->group(function() {

    // Login
    Route::controller(ControllersLogin::class)->group(function() {
        Route::middleware('guest')->group(function() {
            Route::get('login', 'create')->name('login');
            Route::post('login', 'store')->name('login.store');
        });
        Route::middleware(['web', 'auth'])->group(function() {
            Route::get('logout', 'logout')->name('logout');
        });
    });

    // Register
    Route::controller(ControllersRegister::class)->middleware('guest')->group(function() {
        Route::get('register', 'create')->name('register');
        Route::post('register', 'store')->name('register.store');
    });

    // Password Reset
    Route::controller(ControllersPassword::class)->middleware('guest')->name('password.')->group(function() {
        Route::get('forgot-password', 'forget')->name('request');
        Route::post('forgot-password', 'sendResetLinkEmail')->name('email');
        Route::get('reset-password/{token}', 'reset')->name('reset');
        Route::post('reset-password', 'update')->name('update');
    });

    // Email Verification
    Route::controller(ControllersEmail::class)->name('verification.')->group(function() {

        Route::get('verify-email/{token}', 'verify')->name('verify');
        
        Route::middleware(['web', 'auth'])->group(function() {
            Route::get('verify-email', 'notice')->name('notice');
            Route::post('verification-notification', 'sendVerificationEmail')->name('send');

            Route::get('change-email', 'editEmail')->name('email.edit');
            Route::post('change-email', 'updateEmail')->name('email.update');
        });
    });
});
