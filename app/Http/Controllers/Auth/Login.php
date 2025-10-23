<?php

// app/Http/Controllers/Auth/Login.php

namespace App\Http\Controllers\Auth;

// Necessary imports
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;

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
    public function create(): Response
    {
        return Inertia::render('auth/login', ['canResetPassword' => true]);
    }

    /**
     * Authenticate the user.
     * 
     * @param \App\Http\Requests\Auth\Login $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(RequestsLogin $request): RedirectResponse
    {
        /** @var \Illuminate\Http\Request $request */
        $data = $request->validated();

        $credentials = [
            'email' => $data['email'],
            'password' => $data['password'],
        ];

        if (!Auth::attempt($credentials, $data['remember'] ?? false)) {
            return redirect()->back()
                ->withInput($request->only('email', 'remember'))
                ->with(['error' => [
                    'title' => __('common.error'),
                    'description' => __('auth.login.invalid_credentials')
                ]]);
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))
            ->with(['success' => __('auth.login.success')]);
    }


    /**
     * Log the user out of the application.
     * 
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('home')->with(['success' => __('auth.logout.success')]);
    }
}
