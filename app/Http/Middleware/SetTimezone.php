<?php

// app/Http/Middleware/SetTimezone.php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class SetTimezone
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::check() && Auth::user()->timezone) {
            $timezone = Auth::user()->timezone;
            if (in_array($timezone, \DateTimeZone::listIdentifiers(), true)) {
                date_default_timezone_set($timezone);
            }
        } else {
            date_default_timezone_set(config('app.timezone', 'UTC'));
        }

        return $next($request);
    }
}
