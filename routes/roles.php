<?php 

// routes/roles.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Roles as ControllersRoles;

Route::prefix('roles/')->name('roles.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {
    
    Route::controller(ControllersRoles::class)->group(function() {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::get('/{role}', 'show')->name('show');
        Route::get('/{role}/edit', 'edit')->name('edit');

        Route::post('/', 'store')->name('store');

        Route::patch('/{role}', 'update')->name('update');

        Route::delete('/{role}', 'destroy')->name('destroy');
    });
});