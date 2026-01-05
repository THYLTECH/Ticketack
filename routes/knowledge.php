<?php

use App\Http\Controllers\Knowledge\SearchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/knowledge', [SearchController::class, 'index'])
        ->name('knowledge.search');

    Route::post('/knowledge/search', [SearchController::class, 'search'])
        ->name('knowledge.api.search');
});
