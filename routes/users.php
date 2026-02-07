<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Users as ControllersUsers;

Route::prefix('users')->name('users.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {

    Route::controller(ControllersUsers::class)->group(function() {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::post('/', 'store')->name('store');

        Route::put('/{user}/restore', 'restore')->withTrashed()->name('restore');
        Route::delete('/{user}/force-delete', 'forceDelete')->withTrashed()->name('force-delete');

        Route::get('/{user}', 'show')->name('show');
        Route::get('/{user}/edit', 'edit')->name('edit');
        Route::post('/{user}', 'update')->name('update');
        Route::delete('/{user}', 'destroy')->name('destroy');
    });
});
