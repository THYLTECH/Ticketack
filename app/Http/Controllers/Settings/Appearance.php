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

class Appearance extends Controller
{
    /**
     * Show the user's appearance settings page.
     */
    public function edit(Request $request): Response
    {
        $themes = config('preferences.themes');
        $colors = config('preferences.colors');

        return Inertia::render('settings/appearance', [
            'themes' => $themes,
            'colors' => $colors,
        ]);
    }

    /**
     * Update the user's profile settings.
     * 
     * @param \App\Http\Requests\Settings\Profile $request
     */
    // public function update(RequestsProfile $request): RedirectResponse
    // {

    // }

    /**
     * Delete the user's account.
     */
    // public function destroy(RequestsDeleteAccount $request): RedirectResponse
    // {

    // }
}
