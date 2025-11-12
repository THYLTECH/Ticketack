<?php

// app/Http/Controllers/Auth/EmailVerification.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Notification;

// Requests
use App\Http\Requests\Auth\Email as RequestsEmail;

// Models
use App\Models\User;

// Notifications
use App\Notifications\VerifyEmail as NotificationsVerifyEmail;

/**
 * Class EmailVerification
 *
 * Handles email verification functionalities.
 */
class EmailVerification extends Controller
{
    /**
     * Show the email verification notice.
     *
     * @return \Inertia\Response
     */
    public function notice(): RedirectResponse|Response
    {
        $user = Auth::user();

        if ($user && $user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('auth/verify-email');
    }

    /**
     * Send the email verification notification.
     *
     * @param  App\Http\Requests\Auth\SendResetLinkEmail  $request
     */
    public function sendVerificationEmail(): RedirectResponse
    {
        // Check if users is not already verified
        if (Auth::user()->email_verified_at !== null) {
            return redirect()->route('dashboard');
        }

        $token = Str::random(12);
        $user = Auth::user();

        $user->update(['verification_token' => $token]);

        Notification::send($user, new NotificationsVerifyEmail($token));

        return redirect()->route('auth.verification.notice')->with([
            'success' => __('auth.flash.verification.link_sent'),
        ]);
    }

    /**
     * Verify the user's email.
     *
     * @param  string  $verification_token
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function verify(string $token): RedirectResponse | Response
    {   
        // Find user by verification token
        $user = User::where('verification_token', $token)->first();

        if (! $user) {
            return redirect()->route('auth.verification.notice')->withErrors(['verification' => __('auth.flash.verification.invalid_token')]);
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('dashboard');
        }

        // Mark the user's email as verified
        $user->markEmailAsVerified();

        return Inertia::render('auth/email-verified');
    }

    /**
     * Display change email page
     *
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function editEmail(): RedirectResponse | Response
    {
        $user = Auth::user();

        if($user->hasVerifiedEmail()) {
            return redirect()->route('settings.profile.edit');
        }

        return Inertia::render('auth/change-email');
    }

    /**
     * Update user's email
     * 
     * @param  \App\Http\Requests\Auth\Email  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateEmail(RequestsEmail $request): RedirectResponse 
    {
        $data = $request->validated();
        $user = Auth::user();

        if(!Auth::validate(['id' => Auth::id(), 'password' => $data['password']])) {
            return redirect()->back()->withErrors([
                'password' => __('profile.flash.incorrect_current_password'),
            ]);
        }

        $emailChanged = array_key_exists('email', $data) && $data['email'] !== $user->email;

        
        if (!$emailChanged) {
            return redirect()->back()->withErrors(['email' => __('auth.flash.email.no_change')]);
        }

        $user->update($data, ['email_verified_at' => null]);

        return redirect()->route('auth.verification.notice')->with(['success' => __('auth.flash.email.change')]);
    }
}
