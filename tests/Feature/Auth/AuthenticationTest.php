<?php

// tests/Feature/Auth/AuthenticationTest.php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;

test('login screen can be rendered', function () {
    $response = $this->get(route('auth.login'));

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    $response = $this->post(route('auth.login.store'), [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    $this->post(route('auth.login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('auth.logout'));

    $this->assertGuest();
    $response->assertRedirect(route('auth.login'));
});

test('users are rate limited', function () {
    $user = User::factory()->create();

    $key = hash('sha256', 'login' . implode('|', [$user->email, '127.0.0.1']));
    RateLimiter::increment($key, amount: 5);

    $response = $this->post(route('auth.login.store'), [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});
