<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, post};

uses(RefreshDatabase::class);

test('user can mark onboarding page as seen', function () {
    $user = User::factory()->create(['onboarding_state' => []]);
    actingAs($user);

    post(route('onboarding.mark-page-seen'), ['page' => 'home'])
        ->assertRedirect();

    $user->refresh();
    expect($user->onboarding_state)->toHaveKey('home', true);
});

test('user cannot mark invalid onboarding page as seen', function () {
    $user = User::factory()->create();
    actingAs($user);

    post(route('onboarding.mark-page-seen'), ['page' => 'invalid_page'])
        ->assertSessionHasErrors(['page']);
});

test('user can skip all onboarding', function () {
    $user = User::factory()->create(['onboarding_state' => []]);
    actingAs($user);

    post(route('onboarding.skip-all'))
        ->assertRedirect();

    $user->refresh();
    expect($user->onboarding_state)->toHaveKey('home', true)
        ->and($user->onboarding_state)->toHaveKey('tickets', true);
});


test('user can reset onboarding', function () {
    $user = User::factory()->create([
        'onboarding_state' => ['home' => true]
    ]);
    actingAs($user);

    post(route('onboarding.reset'))
        ->assertRedirect();

    $user->refresh();
    expect($user->onboarding_state)->toBeNull();
});
