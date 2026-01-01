<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, delete, get, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    // Création des permissions
    Permission::firstOrCreate(['name' => 'view trash']);
    Permission::firstOrCreate(['name' => 'restore items']);
    Permission::firstOrCreate(['name' => 'force delete items']);

    // User admin avec toutes les permissions
    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
});

// --- TESTS EXISTANTS ---

test('trash index page loads and shows deleted items', function () {
    User::factory()->create(['name' => 'Active User']);
    $deletedUser = User::factory()->create(['name' => 'Deleted User']);
    $deletedUser->delete();

    $deletedRole = Role::create(['name' => 'Deleted Role']);
    $deletedRole->delete();

    get(route('trash.index'))
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

    put(route('trash.restore', ['type' => 'user', 'id' => $user->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted($user);
});

test('can permanently delete a single user', function () {
    $user = User::factory()->create();
    $user->delete();

    delete(route('trash.force-delete', ['type' => 'user', 'id' => $user->id]))
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

    post(route('trash.bulk-restore'), [
        'type' => 'user',
        'ids' => $idsToRestore
    ])->assertRedirect()->assertSessionHas('success');

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

    post(route('trash.bulk-force-delete'), [
        'type' => 'user',
        'ids' => $idsToDelete
    ])->assertRedirect()->assertSessionHas('success');

    foreach ($idsToDelete as $id) {
        $this->assertDatabaseMissing('users', ['id' => $id]);
    }
    $this->assertDatabaseHas('users', ['id' => $idLeft]);
});

test('restore returns error if item not found', function () {
    put(route('trash.restore', ['type' => 'user', 'id' => 99999]))
        ->assertStatus(404);
});

test('cannot perform actions on unknown types', function () {
    $user = User::factory()->create();
    $user->delete();

    // Avec abort(404) dans le controlleur, ceci passera
    put(route('trash.restore', ['type' => 'spaceship', 'id' => $user->id]))
        ->assertStatus(404);
});

test('trash index shows deleted tickets', function () {
    $ticket = Ticket::factory()->create(['title' => 'Deleted Ticket']);
    $ticket->delete();

    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedTickets.data', 1)
            ->where('deletedTickets.data.0.id', $ticket->id)
            ->where('deletedTickets.data.0.title', 'Deleted Ticket')
        );
});

test('can restore a single ticket', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    put(route('trash.restore', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted($ticket);
});

test('can force delete a single ticket', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    delete(route('trash.force-delete', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($ticket);
});

// --- NOUVEAUX TESTS DE PERMISSIONS ET ASSETS ---

test('user without view permission cannot see trash', function () {
    $user = User::factory()->create(); // Pas de permissions données
    actingAs($user);

    get(route('trash.index'))
        ->assertForbidden(); // Attend une 403
});

test('user without restore permission cannot restore items', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash'); // A le droit de voir mais pas restaurer
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $ticket->delete();

    put(route('trash.restore', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertForbidden();
});

test('user without force delete permission cannot delete items permanently', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash');
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $ticket->delete();

    delete(route('trash.force-delete', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertForbidden();
});

test('can handle assets in trash', function () {
    $asset = Asset::factory()->create(['title' => 'Deleted Asset']);
    $asset->delete();

    // Index
    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedAssets.data', 1)
            ->where('deletedAssets.data.0.id', $asset->id)
        );

    // Restore
    put(route('trash.restore', ['type' => 'asset', 'id' => $asset->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted($asset);
});
