<?php

// routes/auth.php

use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Auth\Login as ControllersLogin;
use App\Http\Controllers\Auth\Register as ControllersRegister;
use App\Http\Controllers\Auth\Password as ControllersPassword;

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
    Route::controller(ControllersPassword::class)->middleware('guest')->group(function() {
        Route::get('forgot-password', 'forgot')->name('password.request');
        Route::post('forgot-password', 'sendResetLinkEmail')->name('password.email');
        Route::get('reset-password/{token}', 'reset')->name('password.reset');
        Route::post('reset-password', 'update')->name('password.update');
    });
});
