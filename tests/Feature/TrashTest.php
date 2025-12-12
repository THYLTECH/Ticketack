<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role; // Ton modèle custom
use App\Models\Asset; // Assure-toi que ce modèle existe
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, delete, get, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view trash']);
    Permission::firstOrCreate(['name' => 'restore items']);
    Permission::firstOrCreate(['name' => 'force delete items']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
});

test('trash index page loads and shows deleted items', function () {
    $activeUser = User::factory()->create(['name' => 'Active User']);
    $deletedUser = User::factory()->create(['name' => 'Deleted User']);
    $deletedUser->delete();

    $deletedRole = Role::create(['name' => 'Deleted Role']);
    $deletedRole->delete();

    $response = get(route('trash.index'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('trash/index')
        ->has('deletedUsers.data', 1)
        ->where('deletedUsers.data.0.id', $deletedUser->id)
            ->has('deletedRoles.data', 1)
            ->where('deletedRoles.data.0.id', $deletedRole->id)
        );
});

test('trash index does not show active items', function () {
    User::factory()->create(['name' => 'Active User']);

    get(route('trash.index'))
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data', 0)
        );
});

test('can search for deleted items', function () {
    $u1 = User::factory()->create(['name' => 'John Doe']);
    $u1->delete();

    $u2 = User::factory()->create(['name' => 'Jane Smith']);
    $u2->delete();

    get(route('trash.index', ['search' => 'John']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('deletedUsers.data.0.name', 'John Doe')
            ->has('deletedUsers.data', 1)
        );
});

test('can restore a single user', function () {
    $user = User::factory()->create();
    $user->delete();

    $response = put(route('trash.restore', ['type' => 'user', 'id' => $user->id]));

    $response
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted($user);
});

test('can permanently delete a single user', function () {
    $user = User::factory()->create();
    $user->delete();

    $response = delete(route('trash.force-delete', ['type' => 'user', 'id' => $user->id]));

    $response
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($user);
});

test('can restore a single role', function () {
    $role = Role::create(['name' => 'Old Role']);
    $role->delete();

    put(route('trash.restore', ['type' => 'role', 'id' => $role->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted('roles', ['id' => $role->id]);
});

test('can bulk restore multiple users', function () {
    $users = User::factory()->count(3)->create();
    foreach ($users as $user) $user->delete();

    $idsToRestore = $users->take(2)->pluck('id')->toArray();
    $idLeftDeleted = $users->last()->id;

    $response = post(route('trash.bulk-restore'), [
        'type' => 'user',
        'ids' => $idsToRestore
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('success');

    foreach ($idsToRestore as $id) {
        $this->assertNotSoftDeleted('users', ['id' => $id]);
    }

    $this->assertSoftDeleted('users', ['id' => $idLeftDeleted]);
});

test('can bulk force delete multiple users', function () {
    $users = User::factory()->count(3)->create();
    foreach ($users as $user) $user->delete();

    $idsToDelete = $users->take(2)->pluck('id')->toArray();
    $idLeft = $users->last()->id;

    $response = post(route('trash.bulk-force-delete'), [
        'type' => 'user',
        'ids' => $idsToDelete
    ]);

    $response
        ->assertRedirect()
        ->assertSessionHas('success');

    foreach ($idsToDelete as $id) {
        $this->assertDatabaseMissing('users', ['id' => $id]);
    }

    $this->assertDatabaseHas('users', ['id' => $idLeft]);
});

test('restore returns error if item not found', function () {
    $response = put(route('trash.restore', ['type' => 'user', 'id' => 99999]));

    $response->assertStatus(404);
});

test('cannot perform actions on unknown types', function () {
    $user = User::factory()->create();
    $user->delete();

    $response = put(route('trash.restore', ['type' => 'spaceship', 'id' => $user->id]));

    $response->assertStatus(404);
});
