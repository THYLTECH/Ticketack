<?php

use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\SetLocale;
use App\Http\Middleware\SetTimezone;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Symfony\Component\HttpKernel\Exception\HttpExceptionInterface;
use Illuminate\Http\Response;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
            SetLocale::class,
            SetTimezone::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->respond(function ($response, Throwable $exception, Request $request) {

            if (app()->environment('testing')) {
                return $response;
            }

           if (config('app.env') !== 'local') {
                $statusCode = $exception instanceof HttpExceptionInterface
                    ? $exception->getStatusCode()
                    : 500;
                
                    
                return redirect()->route('errors.show', ['statusCode' => $statusCode, 'title' => $exception->getMessage()]);
            }

            if ($exception instanceof HttpExceptionInterface) {
                $statusCode = $exception->getStatusCode();
                return redirect()->route('errors.show', ['statusCode' => $statusCode, 'title' => $exception->getMessage()]);
            }

            return $response;
        });
    })->create();
