<?php

// app/Http/Controllers/Settings/Profile.php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use DateTimeZone;

// Requests
use App\Http\Requests\Settings\Profile as RequestsProfile;
use App\Http\Requests\Settings\Lang as RequestsLang;
use App\Http\Requests\Settings\DeleteAccount as RequestsDeleteAccount;

// Models
use App\Models\User;
use App\Models\Attachment;

class Profile extends Controller
{
    /**
     * Show the user's profile settings page.
     */
    public function edit(): Response
    {

        $languages = config('preferences.languages');
        $timezones = config('preferences.timezones');

        return Inertia::render('settings/profile', [
            'timezones' => $timezones,
            'languages' => $languages,
        ]);
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

        $emailChanged = array_key_exists('email', $data) && $data['email'] !== $user->email;

        // Avatar changement
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');

            if($user->avatar) {
                $user->avatar->deleteFile();
            }

            $path = $file->store("users/{$user->id}/avatars", 'public');

            $attachment = Attachment::create([
                'title' => 'User\'s Avatar of ' . $user->name,
                'description' => 'Avatar uploaded by user ' . $user->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => str_replace('public/', '', $path),
                'mime_type' => $file->getMimeType(),
                'file_extension' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
            ]);

            $data['attachment_avatar'] = $attachment->id;
        }

        $user->update($data);

        if ($emailChanged) {
            $user->update(['email_verified_at' => null]);
        }

        Auth::setUser($user->fresh(['avatar']));

        return redirect()->route('settings.profile.edit')->with(['success' => __('settings.flash.profile_updated')]);
    }

    public function update_lang(RequestsLang $request): RedirectResponse
    {
        $data = $request->validated();
        $user = Auth::user();

        $user->update([
            'language' => $data['language'],
            'timezone' => $data['timezone'],
        ]);

        Auth::setUser($user->fresh());

        return redirect()->route('settings.profile.edit')->with(['success' => __('settings.flash.language_updated', [], $data['language'])]);
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
                'password' => __('settings.flash.incorrect_current_password'),
            ]);
        }

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with(['success' => __('settings.flash.account_deleted')]);
    }
}
