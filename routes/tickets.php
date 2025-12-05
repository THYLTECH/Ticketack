<?php 

// routes/tickets.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Tickets\Crud as ControllersCrud;

Route::prefix('tickets/')->name('tickets.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {
    
    // CRUD OPERATIONS
    Route::controller(ControllersCrud::class)->group(function() {
        Route::get('/', 'index')->name('index');
        Route::get('/create', 'create')->name('create');
        Route::get('/{ticket}', 'show')->name('show');
        Route::get('/{ticket}/edit', 'edit')->name('edit');

        Route::post('/', 'store')->name('store');

        Route::patch('/{ticket}', 'update')->name('update');

        Route::delete('/{ticket}', 'destroy')->name('destroy');

        Route::post('/{ticket}/restore', 'restore')
            ->name('restore')
            ->withTrashed();

        Route::delete('/{ticket}/force', 'forceDelete')
            ->name('force_delete')
            ->withTrashed();
    });
});