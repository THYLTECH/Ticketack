<?php

// app/Http/Controllers/Settings/Appearance.php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// Requests
use App\Http\Requests\Settings\Theme as RequestsTheme;
use App\Http\Requests\Settings\ColorScheme as RequestsColorScheme;

class Appearance extends Controller
{
    /**
     * Show the user's appearance settings page.
     */
    public function edit(): Response
    {
        $themes = config('preferences.themes');
        $colors = config('preferences.colors');

        return Inertia::render('settings/appearance', [
            'themes' => $themes,
            'colors' => $colors,
        ]);
    }

    /**
     * Update the user's theme settings.
     * 
     * @param \App\Http\Requests\Settings\Theme $request
     */
    public function update_theme(RequestsTheme $request)
    {
        $data = $request->validated();

        $theme = $data['theme'];

        Auth::user()->update([
            'theme' => $theme,
        ]);

        Auth::user()->fresh();

        return back()->with(['success'=> __('settings.flash.theme_updated')]);
    }

    /**
     * Update the user's color scheme settings.
     * 
     * @param \App\Http\Requests\Settings\ColorScheme $request
     */
    public function update_color(RequestsColorScheme $request)
    {
        $data = $request->validated();

        $colorScheme = $data['color_scheme'];

        Auth::user()->update([
            'color_scheme' => $colorScheme,
        ]);

        Auth::user()->fresh();

        return back()->with(['success'=> __('settings.flash.color_scheme_updated')]);
    }
}
