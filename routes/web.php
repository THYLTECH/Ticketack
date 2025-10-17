<?php

// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

// Common routes
require __DIR__.'/common.php';

// Authentication routes
require __DIR__.'/auth.php';

// Settings routes
require __DIR__.'/settings.php';


// Todo : Tickets, assets, settings etc....








