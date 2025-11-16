<?php

// app/Http/Controllers/Auth/Password.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;

// Models
use App\Models\User;
use App\Models\PasswordResetToken;

// Requests
use App\Http\Requests\Auth\SendResetLinkEmail as RequestsSendResetLinkEmail;
use App\Http\Requests\Auth\ResetPassword as RequestsResetPassword;

// Notifications
use App\Notifications\PasswordReset as NotificationsPasswordReset;

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

            Notification::send($user, new NotificationsPasswordReset($plain_token));
        }

        return redirect()->back()->with(['success' => __('auth.flash.password.reset_link_sent')]);
    }

    /**
     * Show the password reset page.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function reset(string $token): RedirectResponse|Response
    {
        $record = PasswordResetToken::get()->first(function ($r) use ($token) {
            return hash_equals($r->token, hash('sha256', $token));
        });

        if (!$record) {
            return redirect()->route('auth.password.request')->with([
                'error' => [
                    'title' => __('common.flash.error'),
                    'description' => __('auth.flash.password.token_missing')
                ]
            ]);
        }

        $user = $record->user;
        if (!$user) {
            return redirect()->route('auth.password.request')->with([
                'error' => [
                    'title' => __('common.flash.error'),
                    'description' => __('auth.flash.password.user_not_found')
                ]
            ]);
        }

        return Inertia::render('auth/reset-password', [
            'email' => $user->email,
            'token' => $token,
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
            return back()->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.password.user_not_found')]]);
        }

        // Record does not exist
        $record = $user->passwordResetToken()->first();
        if (!$record) {
            return back()->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.password.token_missing')]]);
        }

        // Expiration (60 min)
        if ($record->created_at && $record->created_at->lt(now()->subMinutes(60))) {
            $record->delete();
            return back()->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.password.token_expired')]]);
        }

        // Token does not match
        if (! hash_equals($record->token, hash('sha256', $data['token']))) {
            return back()->with(['error' => ['title' => __('common.flash.error'), 'description' => __('auth.flash.password.token_mismatch')]]);
        }

        // User updated
        $user->update([
            'password' => Hash::make($data['password']), 
            'remember_token' => Str::random(60)
        ]);

        // Invalidation of token
        $record->delete();

        return redirect()->route('auth.login')->with(['success' => __('auth.flash.password.reset_success')]);
    }
}
