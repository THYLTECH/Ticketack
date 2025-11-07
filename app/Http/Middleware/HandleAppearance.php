<?php

// app/Http/Middleware/HandleAppearance.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

/**
 * Middleware to handle appearance settings based on cookies.
 */
class HandleAppearance
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if($user) {
            $appearance = $user->theme;
            $colorScheme = $user->color_scheme;
        } else {
            $appearance = $request->cookie('appearance') ?? 'system';
            $colorScheme = $request->cookie('color-scheme') ?? 'default';
        }

        View::share('appearance', $appearance);
        View::share('color_scheme', $colorScheme);

        return $next($request);
    }
}
