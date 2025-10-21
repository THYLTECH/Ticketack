<?php

// app/Http/Controllers/Auth/Login.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

// Requests
use App\Http\Requests\Auth\Login as RequestsLogin;

/**
 * Class Login
 * 
 * Handles user authentication including login and logout functionalities.
 * 
 * @package App\Http\Controllers\Auth
 */
class Login extends Controller
{
    /**
     * Display the login form.
     */
    public function create()
    {
        return Inertia::render('auth/login', ['canResetPassword' => true]);
    }

    /**
     * Authenticate the user.
     * 
     * @param \App\Http\Requests\Auth\Login $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(RequestsLogin $request)
    {
        $credentials = $request->validated();

        if (!Auth::attempt($credentials, $credentials['remember'] ?? false)) {
            throw ValidationException::withMessages([
                'email' => __('The provided credentials are incorrect.'),
            ]);
        }

        /** @var \Illuminate\Http\Request $request */
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))->with(['success' => 'Logged in successfully.']);
    }

    /**
     * Log the user out of the application.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with(['success' => 'Logged out successfully.']);
    }
}
