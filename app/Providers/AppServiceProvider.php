<?php

namespace App\Providers;

use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Auth\Middleware\EnsureEmailIsVerified;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\URL;

// Models
use App\Models\Asset;
use Spatie\Permission\Models\Role;
use App\Models\User;

// Policies
use App\Policies\Asset as AssetPolicy;
use App\Policies\Role as RolePolicy;
use App\Policies\User as UserPolicy;
use Symfony\Component\HttpFoundation\Request;

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

        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        /** @noinspection PhpParamsInspection */
        Gate::define('viewApiDocs', function (User $user) {
            return $user->hasAnyRole(['admin', 'Admin'])
                || ($user->can('update users') && $user->can('update assets'));
        });

        // Policies
        Gate::policy(Asset::class, AssetPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(User::class, UserPolicy::class);

        // Adding security scheme to the generated OpenAPI spec
        if (class_exists(Scramble::class)) {
            Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
                $openApi->secure(
                    SecurityScheme::http('bearer')
                );
            });
        }

        // Customizing the authentication redirect behavior
        Authenticate::redirectUsing(function ($request) {
            return redirect()->route('auth.login')->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.middleware.auth_required')]])->getTargetUrl();
        });
    }
}
