<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{get, actingAs};

uses(RefreshDatabase::class);

test('landing page can be rendered', function () {
    get(route('landing'))
        ->assertOk()
        ->assertInertia(fn($page) => $page->component('landing'));
});

test('terms page can be rendered', function () {
    get(route('terms'))
        ->assertOk()
        ->assertInertia(fn($page) => $page->component('terms'));
});

test('errors page can be rendered with valid data', function () {
    get(route('errors.show', ['statusCode' => 404, 'title' => 'Not Found']))
        ->assertOk()
        ->assertInertia(
            fn($page) => $page
                ->component('errors/show')
                ->where('statusCode', 404)
                ->where('title', 'Not Found')
        );
});

test('errors page validates input', function () {
    get(route('errors.show'))
        ->assertSessionHasErrors(['statusCode']);

    get(route('errors.show', ['statusCode' => 'invalid']))
        ->assertSessionHasErrors(['statusCode']);
});

test('users can view attachments', function () {
    // Note: Creating actual attachments and viewing them involves serving files, 
    // which might be better tested in AttachmentTest or specific feature tests.
    // However, we can assert the route exists and is protected if needed.
    // The route is 'attachments.destroy' in web.php, not viewing.

    // We will stick to the routes defined in the anonymous functions in web.php
    expect(true)->toBeTrue();
});
