<?php

namespace App\Providers;

use App\Events\TicketCreated;
use App\Listeners\DispatchTicketToAiQueue;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Middleware\Authenticate;

// External Libs
use Dedoc\Scramble\Scramble;
use Dedoc\Scramble\Support\Generator\OpenApi;
use Dedoc\Scramble\Support\Generator\SecurityScheme;

// Models
use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\TicketSchedule;
use App\Models\User;
use Spatie\Permission\Models\Role;

// Policies
use App\Policies\Asset as AssetPolicy;
use App\Policies\Ticket as TicketPolicy;
use App\Policies\TicketSchedulePolicy;
use App\Policies\Role as RolePolicy;
use App\Policies\User as UserPolicy;

// Observers
use App\Observers\TicketObserver;
use App\Observers\TicketAttachmentObserver;

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

        // Force HTTPS in Production
        if ($this->app->environment('production')) {
            URL::forceScheme('https');
        }

        // --- 1. Super-Admin Override Gate ---
        Gate::before(function ($user) {
            return $user->hasRole('admin') ? true : null;
        });

        // --- 2. Documentation API Gate ---
        Gate::define('viewApiDocs', function (User $user) {
            return $user->hasRole('admin')
                || ($user->can('update users') && $user->can('update assets'));
        });

        // --- 3. Enregistrement explicite des Policies ---
        Gate::policy(Asset::class, AssetPolicy::class);
        Gate::policy(Role::class, RolePolicy::class);
        Gate::policy(User::class, UserPolicy::class);
        Gate::policy(Ticket::class, TicketPolicy::class);
        Gate::policy(TicketSchedule::class, TicketSchedulePolicy::class);

        // --- 4. Configuration Scramble (Doc API) ---
        if (class_exists(Scramble::class)) {
            Scramble::afterOpenApiGenerated(function (OpenApi $openApi) {
                $openApi->secure(
                    SecurityScheme::http('bearer')
                );
            });
        }

        // --- 5. Redirection Auth Custom ---
        Authenticate::redirectUsing(function () {
            return redirect()
                ->route('auth.login')
                ->with([
                    'error' => [
                        'title' => __('common.flash.error'),
                        'description' => __('auth.flash.middleware.auth_required')
                    ]
                ])
                ->getTargetUrl();
        });

        // --- 6. Observers ---
        Ticket::observe(TicketObserver::class);
        TicketAttachment::observe(\App\Observers\TicketAttachmentObserver::class);
    }
}
