<?php

namespace App\Providers;

use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;

// Models
use App\Models\Asset;
use Spatie\Permission\Models\Role;

// Policies
use App\Policies\Asset as AssetPolicy;
use App\Policies\Role as RolePolicy;

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

        // Policies
        Gate::policy(Asset::class, AssetPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);

        // Customizing the authentication redirect behavior
        Authenticate::redirectUsing(function ($request) {
            return redirect()->route('auth.login')->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.middleware.auth_required')]])->getTargetUrl();
        });
    }
}
