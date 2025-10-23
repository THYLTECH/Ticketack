<?php

// app/Http/Controllers/Auth/Password.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

// Models
use App\Models\User;

// Requests
use App\Http\Requests\Auth\SendResetLinkEmail as RequestsSendResetLinkEmail;
use App\Http\Requests\Auth\ResetPassword as RequestsResetPassword;

// Jobs
use App\Jobs\SendEmailJob;

// Mails
use App\Mail\Auth\PasswordResetMail;

/**
 * Class PasswordReset
 * 
 * Handles password reset functionalities including sending reset links and updating passwords.
 * 
 * @package App\Http\Controllers\Auth
 */
class Password extends Controller
{
    /**
     * Show the password reset link request page.
     * 
     * @return \Inertia\Response
     */
    public function forget(): Response
    {
        return Inertia::render('auth/forgot-password');
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     * @param \App\Http\Requests\Auth\SendResetLinkEmail $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function sendResetLinkEmail(RequestsSendResetLinkEmail $request): RedirectResponse
    {
        $data = $request->validated();

        $plain_token = Str::random(64);
        $hashed_token = hash('sha256', $plain_token);

        $user = User::where('email', $data['email'])->first();

        if($user) {
            $user->passwordResetToken()->updateOrCreate(
                ['email' => $user->email],
                ['token' => $hashed_token, 'created_at' => now()]
            );

            $mail = new PasswordResetMail($user, $plain_token);
            SendEmailJob::dispatch($mail);
        }

        return redirect()->back()->with(['success' => __('auth.password.reset_link_sent')]);
    }

    /**
     * Show the password reset page.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function reset(Request $request): Response
    {
        return Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]);
    }

    /**
     * Handle an incoming new password request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function update(RequestsResetPassword $request): RedirectResponse
    {
        $data = $request->validated();

        // User does not exist
        $user = User::where('email', $data['email'])->first();
        if (!$user) {
            return back()->with(['error' => ['title' => __('common.error'), 'description' => __('auth.password.user_not_found')]]);
        }

        // Record does not exist
        $record = $user->passwordResetToken()->first();
        if (!$record) {
            return back()->with(['error' => ['title' => __('common.error'), 'description' => __('auth.password.token_missing')]]);
        }

        // Expiration (60 min)
        if ($record->created_at && $record->created_at->lt(now()->subMinutes(60))) {
            $record->delete();
            return back()->with(['error' => ['title' => __('common.error'), 'description' => __('auth.password.token_expired')]]);
        }

        // Token does not match
        if (! hash_equals($record->token, hash('sha256', $data['token']))) {
            return back()->with(['error' => ['title' => __('common.error'), 'description' => __('auth.password.token_mismatch')]]);
        }

        // User updated
        $user->update([
            'password' => Hash::make($data['password']), 
            'remember_token' => Str::random(60)
        ]);

        // Invalidation of token
        $record->delete();

        return redirect()->route('auth.login')->with(['success' => __('auth.password.reset_success')]);
    }
}
