<?php

// app/Http/Controllers/Settings/Password.php

namespace App\Http\Controllers\Settings;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// Requests
use App\Http\Requests\Settings\Password as RequestsPassword;


class Password extends Controller
{
    /**
     * Show the user's password settings page.
     */
    public function edit(): Response
    {
        return Inertia::render('settings/password');
    }

    /**
     * Update the user's password.
     * 
     * @param \App\Http\Requests\Settings\Password $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(RequestsPassword $request): RedirectResponse
    {
        $data = $request->validated();

        if(!Auth::validate(['id' => Auth::id(), 'password' => $data['current_password']])) {
            return redirect()->back()->withErrors([
                'current_password' => __('settings.flash.incorrect_current_password'),
            ]);
        }

        Auth::user()->update([
            'password' => $data['password'],
        ]);

        return redirect()->back()->with(['success' => __('settings.flash.password_updated')]);
    }
}
