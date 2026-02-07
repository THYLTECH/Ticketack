<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use App\Http\Middleware\SetTimezone;
use Illuminate\Auth\Middleware\Authenticate;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Inertia\Inertia;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        channels: __DIR__.'/../routes/channels.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);
        $middleware->trustProxies(at: '*');

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SetLocale::class,
            SetTimezone::class,
        ]);

        $middleware->api(append: [
            \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        ]);

        $middleware->redirectUsersTo(fn () => route('home'));
        Authenticate::redirectUsing(function ($request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated.'], 401);
            }
            return route('auth.login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function ($response, Throwable $exception, Request $request) {

            if (app()->environment('testing')) {
                return $response;
            }

            if ($request->is('api/*') || $request->wantsJson()) {
                return $response;
            }

            if ($exception instanceof \Illuminate\Auth\Access\AuthorizationException ||
                ($exception instanceof HttpExceptionInterface && $exception->getStatusCode() === 403)) {

                $title = $exception->getMessage() ?: null;

                return Inertia::render('errors/show', [
                    'statusCode' => 403,
                    'title' => $title,
                ])->toResponse($request)
                    ->setStatusCode(403);
            }

            if (config('app.env') !== 'local' && $exception instanceof HttpExceptionInterface) {
                $statusCode = $exception->getStatusCode();

                if ($statusCode !== 403) {
                    return redirect()->route('errors.show', [
                        'statusCode' => $statusCode,
                        'title' => $exception->getMessage()
                    ]);
                }
            }

            return $response;
        });
    })
    ->create();
