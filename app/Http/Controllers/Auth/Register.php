<?php

// app/Http/Controllers/Auth/Register.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

// Models
use App\Models\User;

// Requests
use App\Http\Requests\Auth\Register as RequestsRegister;

// Jobs
use App\Jobs\SendEmailJob;

// Mails
use App\Mail\Auth\RegisteredEmail;

/**
 * Class Register
 * 
 * Handles user registration functionalities.
 * 
 * @package App\Http\Controllers\Auth
 */
class Register extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     * @param \App\Http\Requests\Auth\Register $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(RequestsRegister $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create($data);

        $mail = new RegisteredEmail($user);
        SendEmailJob::dispatch($mail, $user->email);

        Auth::login($user);

        /** @var \Illuminate\Http\Request $request */
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))->with(['success' => __('auth.register.success')]);
    }
}
