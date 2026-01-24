<?php


use App\Http\Controllers\AttachmentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\App;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use App\Http\Controllers\HomeController;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('landing');

Route::get('/terms', function () {
    return Inertia::render('terms');
})->name('terms');

Route::middleware(['auth', 'verified:auth.verification.notice'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');


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

Route::middleware(['auth', 'verified:auth.verification.notice'])->group(function () {
    Route::get('/home', [HomeController::class, 'index'])->name('home');

    Route::delete('/attachments/{attachment}', [AttachmentController::class, 'destroy'])
        ->name('attachments.destroy');

    Route::post('/onboarding/mark-page-seen', [\App\Http\Controllers\OnboardingController::class, 'markPageSeen'])
        ->name('onboarding.mark-page-seen');
    Route::post('/onboarding/skip-all', [\App\Http\Controllers\OnboardingController::class, 'skipAll'])
        ->name('onboarding.skip-all');
    Route::post('/onboarding/reset', [\App\Http\Controllers\OnboardingController::class, 'reset'])
        ->name('onboarding.reset');
});

require __DIR__.'/auth.php';

require __DIR__.'/settings.php';

require __DIR__.'/notifications.php';

require __DIR__.'/assets.php';

require __DIR__.'/roles.php';

require __DIR__.'/users.php';

require __DIR__.'/trash.php';

require __DIR__.'/tickets.php';

require __DIR__.'/dashboard.php';

require __DIR__.'/knowledge.php';








