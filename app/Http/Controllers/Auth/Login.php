<?php

// app/Http/Controllers/Auth/Login.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\Login as RequestsLogin;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
// Requests
use Inertia\Inertia;

/**
 * Class Login
 *
 * Handles user authentication including login and logout functionalities.
 */
class Login extends Controller
{
    /**
     * Display the login form.
     */
    public function create()
    {
        return Inertia::render('auth/login');
    }

    /**
     * Authenticate the user.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(RequestsLogin $request)
    {
        $credentials = $request->validated();

        if (! Auth::attempt($credentials, $credentials['remember'] ?? false)) {
            throw ValidationException::withMessages([
                'email' => __('The provided credentials are incorrect.'),
            ]);
        }

        /** @var \Illuminate\Http\Request $request */
        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'));
    }

    /**
     * Log the user out of the application.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home');
    }
}
