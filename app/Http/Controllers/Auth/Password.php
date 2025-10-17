<?php

// app/Http/Controllers/Auth/Password.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Password as FacadesPassword;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

// Models
use App\Models\User;

// Requests
use App\Http\Requests\Auth\SendResetLinkEmail as RequestsSendResetLinkEmail;
use App\Http\Requests\Auth\ResetPassword as RequestsResetPassword;

// Events
use Illuminate\Auth\Events\PasswordReset as EventsPasswordReset;

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
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function forget(Request $request): Response
    {
        return Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]);
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

        FacadesPassword::sendResetLink(
            $data['email']
        );

        return back()->with('status', __('A reset link will be sent if the account exists.'));
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

        // Here we will attempt to reset the user's password. If it is successful we
        // will update the password on an actual user model and persist it to the
        // database. Otherwise we will parse the error and return the response.
        $status = Password::reset(
            $data,
            function (User $user) use ($data) {
                $user->forceFill([
                    'password' => $data['password'],
                    'remember_token' => Str::random(60),
                ])->save();

                event(new EventsPasswordReset($user));
            }
        );

        // If the password was successfully reset, we will redirect the user back to
        // the application's home authenticated view. If there is an error we can
        // redirect them back to where they came from with their error message.
        if ($status == FacadesPassword::PASSWORD_RESET) {
            return to_route('login')->with('status', __($status));
        }

        throw ValidationException::withMessages([
            'email' => [__($status)],
        ]);
    }
}
