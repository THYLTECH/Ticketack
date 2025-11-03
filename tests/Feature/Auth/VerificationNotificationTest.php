<?php

// tests/Feature/Auth/VerificationNotificationTest.php

use App\Models\User;
use App\Jobs\SendEmailJob;
use Illuminate\Support\Facades\Queue;

test('sends verification notification', function () {
    Queue::fake();

    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);

    $response = $this->actingAs($user)->post(route('auth.verification.send'));

    $response->assertRedirect(route('auth.verification.notice'));
    $response->assertSessionHas('success');
    Queue::assertPushed(SendEmailJob::class);

    expect($user->fresh()->verification_token)->not->toBeNull();
});

test('does not send verification notification if email is verified', function () {
    Queue::fake();

    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this->actingAs($user)->post(route('auth.verification.send'));

    $response->assertRedirect(route('dashboard'));
    Queue::assertNothingPushed();
});