<?php

use App\Http\Controllers\Tickets\Categories as ControllersCategories;
use App\Http\Controllers\Tickets\Comments as ControllersComments;
use App\Http\Controllers\Tickets\Crud as ControllersCrud;
use App\Http\Controllers\Tickets\Entries as ControllersEntries;
use App\Http\Controllers\Tickets\PdfExport;
use App\Http\Controllers\Tickets\Priorities as ControllersPriorities;
use App\Http\Controllers\Tickets\Schedules as ControllersSchedules;
use App\Http\Controllers\Tickets\Statuses as ControllersStatuses;
use App\Models\Attachment;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::middleware(['auth'])->group(function () {
    Route::get('/tickets/{ticket}/pdf', [PdfExport::class, 'generate'])->name('tickets.pdf');

    Route::delete('/attachments/{attachment}', function (Attachment $attachment) {
        $comment = $attachment->comments()->first();

        if (!$comment) {
            abort(404);
        }

        if ($comment->user_id !== auth()->id() && !auth()->user()->hasRole('admin')) {
            abort(403);
        }

        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return back();
    })->name('attachments.destroy');
});

Route::prefix('tickets')->name('tickets.')->middleware(['auth', 'verified:auth.verification.notice'])->group(function () {

    Route::controller(ControllersEntries::class)->prefix('entries')->name('entries.')->group(function () {
        Route::get('/', 'index')->name('index');
        Route::post('/', 'store')->name('store');
        Route::delete('/{entry}', 'destroy')->name('destroy');
        Route::get('/report', 'report')->name('report');
    });

    Route::controller(ControllersSchedules::class)->group(function () {
        Route::get('/planning', 'index')->name('planning.index');
        Route::post('/planning', 'store')->name('planning.store');
        Route::put('/planning/{schedule}', 'update')->name('planning.update');
        Route::delete('/planning/{schedule}', 'destroy')->name('planning.destroy');
        Route::post('/planning/{schedule}/convert', 'convert')->name('planning.convert');
    });

    Route::controller(ControllersCrud::class)->group(function () {
        Route::get('/', 'index')->name('index');
        Route::get('/manage', 'manage')->name('manage');
        Route::get('/create', 'create')->name('create');
        Route::get('/{ticket}', 'show')->name('show');
        Route::get('/{ticket}/edit', 'edit')->name('edit');
        Route::post('/', 'store')->name('store');
        Route::put('/{ticket}', 'update')->name('update');
        Route::delete('/{ticket}', 'destroy')->name('destroy');
        Route::post('/{ticket}/restore', 'restore')->name('restore')->withTrashed();
        Route::delete('/{ticket}/force', 'forceDelete')->name('force_delete')->withTrashed();
    });

    Route::controller(ControllersPriorities::class)->group(function () {
        Route::patch('/priorities/save', 'save')->name('priorities.save');
    });

    Route::controller(ControllersStatuses::class)->group(function () {
        Route::patch('/statuses/save', 'save')->name('statuses.save');
    });

    Route::controller(ControllersCategories::class)->group(function () {
        Route::patch('/categories/save', 'save')->name('categories.save');
    });

    Route::controller(ControllersComments::class)->group(function () {
        Route::post('/{ticket}/comments', 'store')->name('comments.store');
        Route::put('/{ticket}/comments/{comment}', 'update')->name('comments.update');
        Route::delete('/{ticket}/comments/{comment}', 'destroy')->name('comments.destroy');
    });
});
