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
})->name('home');

Route::middleware(['auth', 'verified:auth.verification.notice'])->group(function () {
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

// Todo : Tickets, assets, settings etc....








