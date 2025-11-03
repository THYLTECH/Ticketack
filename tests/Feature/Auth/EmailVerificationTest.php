<?php

// tests/Feature/Auth/EmailVerificationTest.php

use App\Models\User;

test('email verification screen can be rendered', function () {
    $user = User::factory()->unverified()->create();

    $response = $this->actingAs($user)->get(route('auth.verification.notice'));

    $response->assertStatus(200);
});

test('email can be verified', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
        'verification_token' => sha1('my_token'),
        'email' => 'test@example.com',
    ]);

    $verificationUrl = route('auth.verification.verify', ['token' => $user->verification_token]);

    $response = $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertStatus(200);
});

test('email is not verified with invalid hash', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
        'verification_token' => sha1('my_token'),
        'email' => 'test@example.com',
    ]);

    $verificationUrl = route(
        'auth.verification.verify',
        ['token' => sha1('wrong-token')]
    );

    $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});

test('verified user is redirected to dashboard from verification prompt', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($user)->get(route('auth.verification.notice'));

    $response->assertRedirect(route('dashboard'));
});

test('already verified user visiting verification link is redirected', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
        'verification_token' => sha1('my_token'),
        'email' => 'test@example.com',
    ]);

    $verificationUrl = route('auth.verification.verify', ['token' => $user->verification_token]);

    $response = $this->actingAs($user)->get($verificationUrl);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();

    $response->assertStatus(200);

    $this->actingAs($user)->get($verificationUrl)
        ->assertRedirect(route('dashboard', absolute: false));

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
});