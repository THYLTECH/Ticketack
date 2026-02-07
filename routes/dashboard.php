<?php
    //routes/dashboard.php

    //Necessary imports
    use Illuminate\Support\Facades\Route;
    use App\Http\Controllers\DashboardController;

    Route::middleware(['auth', 'can:view dashboard'])->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });