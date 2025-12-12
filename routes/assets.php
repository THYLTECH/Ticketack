<?php 

// routes/assets.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Assets as ControllersAssets;

Route::prefix('assets/')->name('assets.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {
    
    Route::controller(ControllersAssets::class)->group(function() {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::get('/{asset}', 'show')->name('show');
        Route::get('/{asset}/edit', 'edit')->name('edit');

        Route::post('/', 'store')->name('store');

        // Forced to use POST due to HTML form limitations for file uploads
        Route::post('/{asset}', 'update')->name('update');

        Route::delete('/{asset}', 'destroy')->name('destroy');

        Route::post('/{asset}/restore', 'restore')
            ->name('restore')
            ->withTrashed();

        Route::delete('/{asset}/force', 'forceDelete')
            ->name('force_delete')
            ->withTrashed();
    });
});