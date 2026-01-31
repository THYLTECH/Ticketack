<?php


namespace App\Http\Middleware;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;

/**
 * Middleware to handle Inertia requests and share common data.
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        $user = $request->user()?->load([
            'avatar',
            'roles',
            'notifications' => fn($q) => $q->whereNull('read_at'),
        ]);


        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'avatar' => $user->avatar,
                    'email_verified_at' => $user->email_verified_at,
                    'language' => $user->language,
                    'timezone' => $user->timezone,
                    'theme' => $user->theme,
                    'color_scheme' => $user->color_scheme,
                    'phone' => $user->phone,
                    'roles' => $user->roles,
                    'permissions' => $user->getAllPermissions(),
                ] : null,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'old' => fn () => session()->getOldInput(),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'errors' => fn () => $request->session()->get('errors')
                ? $request->session()->get('errors')->getBag('default')->getMessages()
                : (object) [],

            'locale' => App::getLocale(),
            'fallback_locale' => config('app.fallback_locale'),

            'translations' => fn () => collect(File::files(lang_path(App::getLocale())))
                ->mapWithKeys(function ($file) {
                    $name = pathinfo($file, PATHINFO_FILENAME);
                    $lines = Lang::get($name);

                    return [$name => Arr::undot($lines)];
                })
                ->toArray(),

            'translations_fallback' => fn () => collect(File::files(lang_path(config('app.fallback_locale'))))
                ->mapWithKeys(function ($file) {
                    $name = pathinfo($file, PATHINFO_FILENAME);
                    $lines = Lang::get($name, [], config('app.fallback_locale'));

                    return [$name => Arr::undot($lines)];
                })
                ->toArray(),

            'timezone' => date_default_timezone_get(),

            'unread_notifications' => $request->user() ? $request->user()->notifications()->whereNull('read_at')->count() : 0,

            'unassigned_tickets_count' => $request->user() && $request->user()->can('be assigned tickets')
                ? Ticket::whereDoesntHave('assignees')->whereNull('deleted_at')->count()
                : 0,

            'show_onboarding' => $request->user()
                && $request->user()->hasRole('simple_user'),

            'onboarding_state' => $request->user()
                ? ($request->user()->onboarding_state ?? [])
                : [],
        ]);

    }
}
