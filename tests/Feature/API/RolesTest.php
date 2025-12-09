<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\withHeaders;

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view roles']);
    Permission::firstOrCreate(['name' => 'create roles']);

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo(Permission::all());

    $this->token = $this->admin->createToken('admin')->plainTextToken;
    $this->headers = ['Authorization' => 'Bearer ' . $this->token];
});

test('can list roles', function () {
    Role::create(['name' => 'Test Role']);

    withHeaders($this->headers)
        ->getJson('/api/roles')
        ->assertStatus(200)
        ->assertJsonFragment(['name' => 'Test Role']);
});

test('can create role with permissions', function () {
    Permission::create(['name' => 'edit articles']);

    withHeaders($this->headers)
        ->postJson('/api/roles', [
            'name' => 'New Role',
            'permissions' => ['edit articles']
        ])
        ->assertStatus(201);

    $this->assertDatabaseHas('roles', ['name' => 'New Role']);
});
