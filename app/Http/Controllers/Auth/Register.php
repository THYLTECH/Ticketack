<?php

// app/Http/Controllers/Auth/Register.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\Register as RequestsRegister;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
// Models
use Illuminate\Support\Facades\Auth;
// Requests
use Inertia\Inertia;
// Events
use Inertia\Response;

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
     */
    public function store(RequestsRegister $request): RedirectResponse
    {
        $data = $request->validated();

        $user = User::create($data);

        event(new Registered($user));

        Auth::login($user);

        /** @var \Illuminate\Http\Request $request */
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }
}
