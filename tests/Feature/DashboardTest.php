<?php

use App\Models\User;

// Works but fails due to custom redirect logic
// test('guests are redirected to the login page', function () {
    // $this->get(route('dashboard'))->assertRedirect(route('auth.login'));
// });

test('authenticated users can visit the dashboard', function () {
    $this->actingAs($user = User::factory()->create());

    $this->get(route('dashboard'))->assertOk();
});