<?php 

// routes/users.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Users as ControllersUsers;

Route::prefix('users/')->name('users.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {
    
    Route::controller(ControllersUsers::class)->group(function() {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::get('/{user}', 'show')->name('show');
        Route::get('/{user}/edit', 'edit')->name('edit');
        Route::post('/', 'store')->name('store');

        Route::patch('/{user}', 'update')->name('update');

        Route::delete('/{user}', 'destroy')->name('destroy');
    });
});