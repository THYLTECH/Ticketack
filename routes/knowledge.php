<?php

use App\Http\Controllers\Knowledge\SearchController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {

    Route::get('/knowledge', [SearchController::class, 'index'])
        ->name('knowledge.search');

});
