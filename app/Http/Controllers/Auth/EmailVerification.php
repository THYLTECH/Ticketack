<?php

// app/Http/Controllers/Auth/EmailVerification.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

// Models
use App\Models\User;

// Jobs
use App\Jobs\SendEmailJob;

// Mails
use App\Mail\Auth\VerifyEmail;

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
    public function notice(Request $request): Response
    {
        $status = $request->session()->get('status');

        return Inertia::render('auth/verify-email', [
            'status' => $status,
        ]);
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

        $mail = new VerifyEmail($user, $token);
        SendEmailJob::dispatch($mail);

        return redirect()->route('auth.verification.notice')->with([
            'success' => __('auth.verification.link_sent'),
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
            return redirect()->route('auth.verification.notice')->withErrors(['verification' => __('auth.verification.invalid_token')]);
        }

        // Mark the user's email as verified
        $user->update([
            'email_verified_at' => now(),
            'verification_token' => null,
        ]);

        return Inertia::render('auth/email-verified');
    }
}
