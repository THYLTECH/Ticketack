<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // Customizing the authentication redirect behavior
        Authenticate::redirectUsing(function ($request) {
            return redirect()->route('auth.login')->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.middleware.auth_required')]])->getTargetUrl();
        });
    }
}
