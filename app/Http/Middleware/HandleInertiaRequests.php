<?php

// app/Http/Middleware/HandleInertiaRequests.php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Lang;
use Inertia\Middleware;
use Illuminate\Support\Facades\Auth;

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

        $userAvatar = null;

        if ($request->user()) {
            $user = $request->user();

            if ($user->avatar) {
                $userAvatar = ['url' => $user->avatar->getUrl()];
            } elseif (!empty($user->attachment_avatar)) {
                $userAvatar = ['url' => Storage::url($user->attachment_avatar)];
            }
        }

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user() ? [
                    'id' => $request->user()->id,
                    'name' => $request->user()->name,
                    'email' => $request->user()->email,
                    'avatar' => $userAvatar,
                    'email_verified_at' => $request->user()->email_verified_at,
                    'language' => $request->user()->language,
                    'timezone' => $request->user()->timezone,
                    'theme' => $request->user()->theme,
                    'color_scheme' => $request->user()->color_scheme,
                    'phone' => $request->user()->phone,
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
        ]);

        // 'translations' => fn () => Cache::rememberForever('translations_'.App::getLocale(), function () {
        //     return collect(File::files(lang_path(App::getLocale())))
        //         ->mapWithKeys(function ($file) {
        //             $name = pathinfo($file, PATHINFO_FILENAME);

        //             return [$name => trans($name)];
        //         })
        //         ->toArray();
        // }),
    }
}
