<?php

// tests/Feature/Auth/RegistrationTest.php

use Spatie\Permission\Models\Role;

test('registration screen can be rendered', function () {
    $response = $this->get(route('auth.register'));

    $response->assertStatus(200);
});

test('new users can register', function () {
    Role::create(['name' => 'simple_user']);

    $response = $this->post(route('auth.register.store'), [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password',
        'password_confirmation' => 'password',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});
