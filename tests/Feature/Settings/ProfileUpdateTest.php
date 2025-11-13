<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'phone' => null,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+33611223344',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->phone)->toBe('+33611223344');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
            'phone' => null,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('language and timezone can be updated', function () {
    $user = User::factory()->create([
        'language' => 'en',
        'timezone' => 'UTC',
    ]);

    $validLanguage = config('preferences.languages')[0]['code'];
    $validTimezone = config('preferences.timezones')[0]['value'];

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update_lang'), [
            'language' => $validLanguage,
            'timezone' => $validTimezone,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.profile.edit'));

    $user->refresh();

    expect($user->language)->toBe($validLanguage);
    expect($user->timezone)->toBe($validTimezone);
});

test('invalid language is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update_lang'), [
            'language' => 'invalid_lang',
            'timezone' => 'UTC',
        ]);

    $response->assertSessionHasErrors('language');
});

test('invalid timezone is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update_lang'), [
            'language' => 'en',
            'timezone' => 'invalid_timezone',
        ]);

    $response->assertSessionHasErrors('timezone');
});

test('user can delete their account', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('settings.profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();
    expect($user->fresh())->toBeNull();
});

test('correct password must be provided to delete account', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this
        ->actingAs($user)
        ->from(route('settings.profile.edit'))
        ->delete(route('settings.profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('settings.profile.edit'));

    expect($user->fresh())->not->toBeNull();
});
