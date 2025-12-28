<?php


use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\Tickets\Crud as ControllersCrud;
use App\Http\Controllers\Tickets\Priorities as ControllersPriorities;
use App\Http\Controllers\Tickets\Statuses as ControllersStatuses;
use App\Http\Controllers\Tickets\Categories as ControllersCategories;
use App\Http\Controllers\Tickets\Comments as ControllersComments;
use App\Http\Controllers\Tickets\Schedules as ControllersSchedules;

Route::prefix('tickets')->name('tickets.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function() {

    // PLANNING & SCHEDULE OPERATIONS
    Route::controller(ControllersSchedules::class)->group(function() {
        Route::get('/planning', 'index')->name('planning.index');
        Route::post('/planning', 'store')->name('planning.store');
        Route::put('/planning/{schedule}', 'update')->name('planning.update');
        Route::delete('/planning/{schedule}', 'destroy')->name('planning.destroy');
    });

    // CRUD OPERATIONS
    Route::controller(ControllersCrud::class)->group(function() {
        Route::get('/', 'index')->name('index');
        Route::get('/manage', 'manage')->name('manage');
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
        Route::patch('/statuses/save', 'save')->name('statuses.save');
    });

    // CATEGORIES OPERATIONS
    Route::controller(ControllersCategories::class)->group(function() {
        Route::patch('/categories/save', 'save')->name('categories.save');
    });

    Route::controller(ControllersComments::class)->group(function() {
        Route::post('/{ticket}/comments', 'store')->name('comments.store');
    });

});
