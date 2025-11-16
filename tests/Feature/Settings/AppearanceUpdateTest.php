<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('appearance page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.appearance.edit'));

    $response->assertOk();
});

test('user can update their theme', function () {
    $user = User::factory()->create();

    $validTheme = config('preferences.themes')[0]['value'];

    $response = $this
        ->actingAs($user)
        ->put(route('settings.appearance.update_theme', absolute: false), [
            'theme' => $validTheme,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(); // back()

    $user->refresh();

    expect($user->theme)->toBe($validTheme);
});

test('invalid theme is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->put(route('settings.appearance.update_theme', absolute: false), [
            'theme' => 'invalid_theme',
        ]);

    $response
        ->assertSessionHasErrors('theme')
        ->assertRedirect();
});

test('user can update their color scheme', function () {
    $user = User::factory()->create();

    $validColor = config('preferences.colors')[0]['value'];

    $response = $this
        ->actingAs($user)
        ->put(route('settings.appearance.update_color', absolute: false), [
            'color_scheme' => $validColor,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $user->refresh();

    expect($user->color_scheme)->toBe($validColor);
});

test('invalid color scheme is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->put(route('settings.appearance.update_color', absolute: false), [
            'color_scheme' => 'invalid_color',
        ]);

    $response
        ->assertSessionHasErrors('color_scheme')
        ->assertRedirect();
});
