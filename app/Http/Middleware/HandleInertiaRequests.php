<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\File;
use Inertia\Middleware;
use Illuminate\Support\Facades\Cache;

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

        return array_merge(parent::share($request), [
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
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
            'translations' => fn () => collect(File::files(lang_path(App::getLocale())))
                ->mapWithKeys(function ($file) {
                    $name = pathinfo($file, PATHINFO_FILENAME);

                    return [$name => trans($name)];
                })
                ->toArray(),
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
