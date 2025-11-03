<?php

// routes/settings.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Settings\Password as ControllersPassword;
use App\Http\Controllers\Settings\Profile as ControllersProfile;
use App\Http\Controllers\Settings\Appearance as ControllersAppearance;

Route::prefix('settings/')->name('settings.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {

    Route::controller(ControllersPassword::class)->prefix('password/')->name('password.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        Route::put('/', 'update')->name('update');
    });

    Route::controller(ControllersProfile::class)->prefix('profile/')->name('profile.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        Route::patch('/', 'update')->name('update');
        Route::delete('/', 'destroy')->name('destroy');
    });

    Route::controller(ControllersAppearance::class)->prefix('appearance/')->name('appearance.')->group(function() {
        Route::get('/', 'edit')->name('edit');
        // Route::put('appearance', 'update_theme')->name('appearance.update_theme');
        // Route::put('appearance', 'update_color')->name('appearance.update_color');
    });
});
