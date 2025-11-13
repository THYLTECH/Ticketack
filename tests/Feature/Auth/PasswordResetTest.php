<?php

// tests/Feature/Auth/PasswordResetTest.php

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;
use App\Notifications\PasswordReset;
use Illuminate\Support\Facades\Notification;

test('reset password link screen can be rendered', function () {
    $response = $this->get(route('auth.password.request'));
    $response->assertStatus(200);
});

test('reset password link can be requested', function () {
    Notification::fake();

    $user = User::factory()->create();

    $response = $this->post(route('auth.password.email'), [
        'email' => $user->email
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    Notification::assertSentTo($user, PasswordReset::class);
});


test('reset password screen can be rendered', function () {
    $user = User::factory()->create();
    $plainToken = Str::random(64);

    $user->passwordResetToken()->create([
        'email' => $user->email,
        'token' => hash('sha256', $plainToken),
        'created_at' => now(),
    ]);

    $response = $this->get(route('auth.password.reset', ['token' => $plainToken, 'email' => $user->email]));
    $response->assertStatus(200);
});

test('password can be reset with valid token', function () {
    $user = User::factory()->create();
    $plainToken = Str::random(64);

    $user->passwordResetToken()->create([
        'email' => $user->email,
        'token' => hash('sha256', $plainToken),
        'created_at' => now(),
    ]);

    $response = $this->post(route('auth.password.update'), [
        'token' => $plainToken,
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertRedirect(route('auth.login'));
    $this->assertTrue(Hash::check('newpassword123', $user->fresh()->password));
});

test('password cannot be reset with invalid token', function () {
    $user = User::factory()->create();

    $response = $this->post(route('auth.password.update'), [
        'token' => 'invalid',
        'email' => $user->email,
        'password' => 'newpassword123',
        'password_confirmation' => 'newpassword123',
    ]);

    $response->assertSessionHas('error');
});