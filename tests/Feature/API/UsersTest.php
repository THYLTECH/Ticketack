<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\withHeaders;

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view users']);
    Permission::firstOrCreate(['name' => 'create users']);
    Permission::firstOrCreate(['name' => 'update users']);
    Permission::firstOrCreate(['name' => 'delete users']);

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo(Permission::all());

    $this->token = $this->admin->createToken('admin')->plainTextToken;
    $this->headers = ['Authorization' => 'Bearer ' . $this->token];
});

test('admin can list users via api', function () {
    User::factory()->count(3)->create();

    withHeaders($this->headers)
        ->getJson('/api/users')
        ->assertStatus(200)
        ->assertJsonStructure(['data', 'links', 'meta']);
});

test('admin can create a user', function () {
    Role::create(['name' => 'User lambda']);

    withHeaders($this->headers)
        ->postJson('/api/users', [
            'name' => 'API User',
            'email' => 'api@test.com',
            'roles' => ['User lambda'],
            'email_verified' => true
        ])
        ->assertStatus(201)
        ->assertJsonPath('user.email', 'api@test.com');

    $this->assertDatabaseHas('users', ['email' => 'api@test.com']);
});

test('admin can update a user', function () {
    $user = User::factory()->create();

    withHeaders($this->headers)
        ->putJson("/api/users/{$user->id}", [
            'name' => 'Updated API',
        ])
        ->assertStatus(200)
        ->assertJsonPath('user.name', 'Updated API');
});

test('admin can delete a user', function () {
    $user = User::factory()->create();

    withHeaders($this->headers)
        ->deleteJson("/api/users/{$user->id}")
        ->assertStatus(200);

    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('non-admin cannot access users api', function () {
    $user = User::factory()->create();
    $token = $user->createToken('user')->plainTextToken;

    withHeaders(['Authorization' => 'Bearer ' . $token])
        ->getJson('/api/users')
        ->assertStatus(403);
});
