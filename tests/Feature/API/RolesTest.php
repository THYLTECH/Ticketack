<?php

use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\withHeaders;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::firstOrCreate(['name' => 'view roles', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'create roles', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'update roles', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'delete roles', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'create users', 'guard_name' => 'web']); // Pour l'index

    $this->admin = User::factory()->create();
    $this->admin->givePermissionTo(Permission::all());

    $this->token = $this->admin->createToken('admin')->plainTextToken;
    $this->headers = ['Authorization' => 'Bearer ' . $this->token];
});

test('can list roles', function () {
    Role::create(['name' => 'Test Role', 'guard_name' => 'web']);

    withHeaders($this->headers)
        ->getJson('/api/roles')
        ->assertStatus(200)
        ->assertJsonFragment(['name' => 'Test Role']);
});

test('can show role', function () {
    $role = Role::create(['name' => 'Viewer', 'guard_name' => 'web']);

    withHeaders($this->headers)
        ->getJson("/api/roles/{$role->id}")
        ->assertStatus(200)
        ->assertJsonPath('name', 'Viewer');
});

test('can create role with permissions', function () {
    Permission::firstOrCreate(['name' => 'edit articles', 'guard_name' => 'web']);

    withHeaders($this->headers)
        ->postJson('/api/roles', [
            'name' => 'New Role',
            'permissions' => ['edit articles']
        ])
        ->assertStatus(201);

    $this->assertDatabaseHas('roles', ['name' => 'New Role']);
});

test('can update role', function () {
    $role = Role::create(['name' => 'Editor', 'guard_name' => 'web']);

    withHeaders($this->headers)
        ->putJson("/api/roles/{$role->id}", [
            'name' => 'Senior Editor'
        ])
        ->assertStatus(200)
        ->assertJsonPath('role.name', 'Senior Editor');
});

test('can delete role', function () {
    $role = Role::create(['name' => 'Useless Role', 'guard_name' => 'web']);

    withHeaders($this->headers)
        ->deleteJson("/api/roles/{$role->id}")
        ->assertStatus(200);

    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});
