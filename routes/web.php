<?php

// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

Route::middleware(['auth', 'verified:auth.verification.notice'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Authentication routes
require __DIR__.'/auth.php';

// Settings routes
require __DIR__.'/settings.php';

// Todo : Tickets, assets, settings etc....








