<?php

use App\Http\Controllers\TrashController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->prefix('trash')->name('trash.')->group(function () {

    Route::get('/', [TrashController::class, 'index'])->name('index');
    Route::put('/{type}/{id}/restore', [TrashController::class, 'restore'])->name('restore');
    Route::delete('/{type}/{id}', [TrashController::class, 'forceDelete'])->name('force-delete');
    Route::post('/bulk-restore', [TrashController::class, 'bulkRestore'])->name('bulk-restore');
    Route::post('/bulk-force-delete', [TrashController::class, 'bulkForceDelete'])->name('bulk-force-delete');
});
