<?php

// app/Http/Middleware/SetLocale.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Auth;

/**
 * Middleware to set the application locale based on the authenticated user's preference.
 */
class SetLocale
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $locale = Auth::check() && Auth::user()->language
            ? Auth::user()->language
            : config('app.locale');

        App::setLocale($locale);

        return $next($request);
    }
}
