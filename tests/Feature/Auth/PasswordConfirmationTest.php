<?php

use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('confirm password screen can be rendered', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('auth.password.update'));

    $response->assertStatus(200);

    $response->assertInertia(fn (Assert $page) => $page
        ->component('auth/confirm-password')
    );
});

test('password confirmation requires authentication', function () {
    $response = $this->get(route('auth.password.update'));

    $response->assertRedirect(route('auth.login'));
});