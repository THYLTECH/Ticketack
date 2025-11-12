<?php 

// routes/notifications.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Notifications\Index as ControllersIndex;

Route::prefix('notifications/')->name('notifications.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {
    
    Route::controller(ControllersIndex::class)->group(function() {
        Route::get('/', 'index')->name('index');

        Route::put('/{notification}/read', 'markAsRead')->name('markAsRead');
        Route::put('/read', 'markManyAsRead')->name('markManyAsRead');
        
        Route::delete('/{notification}', 'destroy')->name('destroy');
        Route::delete('/', 'destroyMany')->name('destroyMany');
    });
});