<?php

use App\Models\User;
use function Pest\Laravel\post;
use function Pest\Laravel\withHeaders;

test('api login returns token with valid credentials', function () {
    $user = User::factory()->create([
        'email' => 'test@api.com',
        'password' => bcrypt('password'),
    ]);

    post('/api/auth/login', [
        'email' => 'test@api.com',
        'password' => 'password',
    ])
        ->assertStatus(200)
        ->assertJsonStructure(['token', 'user']);
});

test('api login fails with invalid credentials', function () {
    $user = User::factory()->create(['password' => bcrypt('password')]);

    post('/api/auth/login', [
        'email' => $user->email,
        'password' => 'wrong',
    ])
        ->assertStatus(401)
        ->assertJson(['message' => 'Invalid credentials']);
});

test('api logout invalidates token', function () {
    $user = User::factory()->create();
    $token = $user->createToken('test')->plainTextToken;

    withHeaders(['Authorization' => 'Bearer ' . $token])
        ->post('/api/auth/logout')
        ->assertStatus(200)
        ->assertJson(['message' => 'Logged out successfully']);

    $this->assertDatabaseMissing('personal_access_tokens', [
        'token' => hash('sha256', explode('|', $token)[1]),
    ]);
});
