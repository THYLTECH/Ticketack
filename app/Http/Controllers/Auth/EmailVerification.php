<?php

// app/Http/Controllers/Auth/EmailVerification.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

// Models
use App\Models\User;

// Events
// TODO

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
    public function notice(Request $request)
    {
        $status = $request->session()->get('status');

        self::_sendVerificationEmailTo(Auth::user());

        return Inertia::render('auth/verify-email', [
            'status' => $status,
        ]);
    }

    /**
     * Send the email verification notification.
     *
     * @param  App\Http\Requests\Auth\SendResetLinkEmail  $request
     */
    public function sendVerificationEmail()
    {
        // Check if users is not already verified
        if (Auth::user()->email_verified_at !== null) {
            return redirect()->route('dashboard');
        }

        self::_sendVerificationEmailTo(Auth::user());

        return redirect()->route('auth.verification.notice')->with([
            'success' => __('A new verification link has been sent to the email address you provided during registration.')
        ]);
    }

    /**
     * Send verification email to user.
     * 
     * @param  User  $user
     */
    private static function _sendVerificationEmailTo(User $user)
    {
        $token = Str::random(12);

        $user->update(['verification_token' => $token]);

        // TODO : Trigger event that sends mail with token
    }

    /**
     * Verify the user's email.
     *
     * @param  string  $verification_token
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     */
    public function verify($verification_token)
    {
        // Find user by verification token
        $user = User::where('email_verification_token', $verification_token)->first();

        if (! $user) {
            return redirect()->route('auth.verification.notice')->withErrors(['verification' => __('Invalid verification token.')]);
        }

        // Mark the user's email as verified
        $user->update([
            'email_verified_at' => now(),
            'email_verification_token' => null, // Clear the token
        ]);

        return Inertia::render('auth/email-verified');
    }
}
