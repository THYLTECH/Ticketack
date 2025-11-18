<?php

// routes/settings.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Settings\Password as ControllersPassword;
use App\Http\Controllers\Settings\Profile as ControllersProfile;
use App\Http\Controllers\Settings\Appearance as ControllersAppearance;
use App\Http\Controllers\Settings\Notification as ControllersNotification;

Route::prefix('settings/')->name('settings.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {

    Route::controller(ControllersPassword::class)->prefix('password/')->name('password.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        Route::put('/', 'update')->name('update');
    });

    Route::controller(ControllersProfile::class)->prefix('profile/')->name('profile.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::patch('/language', 'update_lang')->name('update_lang');
        Route::delete('/', 'destroy')->name('destroy');
    });


    Route::controller(ControllersAppearance::class)->prefix('appearance/')->name('appearance.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        Route::put('theme', 'update_theme')->name('update_theme');
        Route::put('color_scheme', 'update_color')->name('update_color');
    });

    Route::controller(ControllersNotification::class)->name('notification/')->name('notification.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
    });
});
