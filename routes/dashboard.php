<?php
    //routes/dashboard.php

    //Necessary imports
    use Illuminate\Support\Facades\Route;
    use Inertia\Inertia;
    use App\Http\Controllers\DashboardController;

    //NEXT STEP : Implementation du dashboard en fonction des permissions d'utilisateur
    Route::controller(DashboardController::class)->group(function() {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    });