<?php

// app/Http/Controllers/Settings/Profile.php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// Requests
use App\Http\Requests\Settings\Profile as RequestsProfile;
use App\Http\Requests\Settings\DeleteAccount as RequestsDeleteAccount;

class Profile extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('settings/profile');
    }

    /**
     * Update the user's profile settings.
     * 
     * @param \App\Http\Requests\Settings\Profile $request
     */
    public function update(RequestsProfile $request): RedirectResponse
    {
        $data = $request->validated();

        $user = Auth::user();
        $user->update($data);

        if ($user->isDirty('email')) {
            $user->update(['email_verified_at' => null]);
        }

        return redirect()->route('settings.profile.edit')->with(['success' => 'Profile updated successfully.']);
    }

    /**
     * Delete the user's account.
     * 
     * @param \App\Http\Requests\Settings\DeleteAccount $request
     */
    public function destroy(RequestsDeleteAccount $request): RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $data = $request->validated();
        $user = Auth::user();

        if(!Auth::validate(['email' => $user->email, 'password' => $data['password']])) {
            return back()->withErrors([
                'password' => __('The provided password does not match our records.'),
            ]);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
