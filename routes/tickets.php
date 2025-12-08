<?php 

// routes/tickets.php

// Necessary imports
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Tickets\Crud as ControllersCrud;
use App\Http\Controllers\Tickets\Priorities as ControllersPriorities;
use App\Http\Controllers\Tickets\Statuses as ControllersStatuses;
use App\Http\Controllers\Tickets\Categories as ControllersCategories;

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

    // PRIORITIES OPERATIONS
    Route::controller(ControllersPriorities::class)->group(function() {
        Route::patch('/priorities/save', 'save')->name('priorities.save');
    });

    // STATUSES OPERATIONS
    Route::controller(ControllersStatuses::class)->group(function() {
        Route::get('/statuses', 'fetch')->name('statuses.fetch');
        Route::patch('/statuses/save', 'save')->name('statuses.save');
        Route::post('/statuses', 'store')->name('statuses.store');
        Route::patch('/statuses/{ticket}', 'update')->name('statuses.update');
        Route::delete('/statuses/{ticket}', 'destroy')->name('statuses.destroy');
    });

    // CATEGORIES OPERATIONS
    Route::controller(ControllersCategories::class)->group(function() {
        Route::get('/categories', 'fetch')->name('categories.fetch');
        Route::patch('/categories/save', 'save')->name('categories.save');
        Route::post('/categories', 'store')->name('categories.store');
        Route::patch('/categories/{ticket}', 'update')->name('categories.update');
        Route::delete('/categories/{ticket}', 'destroy')->name('categories.destroy');
    });

});