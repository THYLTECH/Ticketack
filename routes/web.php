<?php

// routes/web.php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

Route::get('/', function () {
    // abort(404);
    return Inertia::render('landing');
})->name('landing');

Route::middleware(['auth', 'verified:auth.verification.notice'])->group(function () {
    // Nouvelle route Home
    Route::get('/home', function () {
        return Inertia::render('home');
    })->name('home');

    Route::get('/dashboard', function () {
        // Notification::send(Auth::user(), new \App\Notifications\Example());
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/errors', function(Request $request) {
    $data = $request->validate([
        'statusCode' => 'required|integer',
        'title' => 'nullable|string',
    ]);

    return Inertia::render('errors/show', [
        'statusCode' => $data['statusCode'],
        'title' => $data['title'] ?? null,
    ]);
})->name('errors.show');

// Authentication routes
require __DIR__.'/auth.php';

// Settings routes
require __DIR__.'/settings.php';

// Notifications routes
require __DIR__.'/notifications.php';

// Assets routes
require __DIR__.'/assets.php';

// Roles routes
require __DIR__.'/roles.php';

// Users routes
require __DIR__.'/users.php';

// Trash routes
require __DIR__.'/trash.php';

// Tickets routes
require __DIR__.'/tickets.php';

// Todo : Tickets, assets, settings etc....








