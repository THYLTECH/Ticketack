<?php

use App\Models\User;
use App\Models\NotificationPreference;
use Illuminate\Support\Facades\Auth;

//
// PAGE DISPLAY
//
test('notification settings page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.notification.edit'));

    $response->assertOk();
});


//
// UPDATE A VALID NOTIFICATION TYPE
//
test('user can update password_reset notification channels', function () {
    $user = User::factory()->create();

    // Fake existing pref
    NotificationPreference::factory()->create([
        'user_id'  => $user->id,
        'category' => 'auth',
        'type'     => 'password_reset',
        'channel'  => 'mail',
        'enabled'  => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.notification.update'), [
            'category' => 'auth',
            'notification_preferences' => [
                [
                    'type'  => 'password_reset',
                    'value' => ['mail', 'vonage'],
                ],
            ],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.notification.edit'));

    $prefs = $user->notificationPreferences()
        ->where('category', 'auth')
        ->where('type', 'password_reset')
        ->get()
        ->keyBy('channel');

    expect($prefs['mail']->enabled)->toBe(true);
    expect($prefs['vonage']->enabled)->toBe(true);
});


//
// DISABLE ALL CHANNELS
//
test('user can disable all channels for a given notification type', function () {
    $user = User::factory()->create();

    NotificationPreference::factory()->create([
        'user_id'  => $user->id,
        'category' => 'auth',
        'type'     => 'verify_email',
        'channel'  => 'mail',
        'enabled'  => true,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.notification.update'), [
            'category' => 'auth',
            'notification_preferences' => [
                [
                    'type'  => 'verify_email',
                    'value' => [], // disable everything
                ],
            ],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.notification.edit'));

    $prefs = $user->notificationPreferences()
        ->where('category', 'auth')
        ->where('type', 'verify_email')
        ->get();

    expect($prefs->every(fn ($p) => $p->enabled === false))->toBeTrue();
});


//
// MULTIPLE TYPES UPDATED AT ONCE
//
test('user can update both auth notification types in one request', function () {
    $user = User::factory()->create();

    NotificationPreference::factory()->create([
        'user_id'  => $user->id,
        'category' => 'auth',
        'type'     => 'password_reset',
        'channel'  => 'mail',
        'enabled'  => false,
    ]);

    NotificationPreference::factory()->create([
        'user_id'  => $user->id,
        'category' => 'auth',
        'type'     => 'verify_email',
        'channel'  => 'mail',
        'enabled'  => false,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.notification.update'), [
            'category' => 'auth',
            'notification_preferences' => [
                [
                    'type'  => 'password_reset',
                    'value' => ['mail'],
                ],
                [
                    'type'  => 'verify_email',
                    'value' => ['vonage'],
                ],
            ],
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.notification.edit'));

    $passwordReset = $user->notificationPreferences()
        ->where('type', 'password_reset')
        ->where('category', 'auth')
        ->pluck('enabled', 'channel')
        ->toArray();

    $verifyEmail = $user->notificationPreferences()
        ->where('type', 'verify_email')
        ->where('category', 'auth')
        ->pluck('enabled', 'channel')
        ->toArray();

    expect($passwordReset['mail'])->toBe(true);
    expect($verifyEmail['vonage'])->toBe(true);
});


//
// VALIDATION — INVALID TYPE
//
test('invalid notification type is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.notification.update'), [
            'category' => 'auth',
            'notification_preferences' => [
                [
                    'type'  => 'invalid_type',
                    'value' => ['mail'],
                ],
            ],
        ]);

    $response->assertSessionHasErrors('notification_preferences.0.type');
});


//
// VALIDATION — INVALID CHANNEL
//
test('invalid notification channel is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.notification.update'), [
            'category' => 'auth',
            'notification_preferences' => [
                [
                    'type'  => 'password_reset',
                    'value' => ['invalid_channel'],
                ],
            ],
        ]);

    $response->assertSessionHasErrors('notification_preferences.0.value.0');
});


//
// VALIDATION — category required
//
test('category is required', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.notification.update'), [
            'notification_preferences' => [
                [
                    'type'  => 'password_reset',
                    'value' => ['mail'],
                ],
            ],
        ]);

    $response->assertSessionHasErrors('category');
});
