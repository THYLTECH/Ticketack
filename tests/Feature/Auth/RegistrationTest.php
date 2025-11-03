<?php

// tests/Feature/Auth/RegistrationTest.php

test('registration screen can be rendered', function () {
    $response = $this->get(route('auth.register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    $response = $this->post(route('auth.register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});