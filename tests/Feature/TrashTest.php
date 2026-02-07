<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\TrashRetention;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs, delete, get, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view trash']);
    Permission::firstOrCreate(['name' => 'restore trash']);
    Permission::firstOrCreate(['name' => 'force delete trash']);
    Permission::firstOrCreate(['name' => 'restore items']);
    Permission::firstOrCreate(['name' => 'force delete items']);
    Permission::firstOrCreate(['name' => 'manage trash']);

    $role = Role::firstOrCreate(['name' => 'admin']);
    $this->user = User::factory()->create();
    $this->user->assignRole($role);

    actingAs($this->user);
});

test('trash index page loads successfully', function () {
    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('trash/index')
            ->has('deletedTickets.data')
            ->has('deletedUsers.data')
            ->has('deletedRoles.data')
            ->has('deletedAssets.data')
            ->has('retentionSettings')
        );
});

test('trash index shows deleted items with correct data', function () {
    $deletedUser = User::factory()->create(['name' => 'Deleted User']);
    $deletedUser->delete();

    $deletedRole = Role::create(['name' => 'Deleted Role']);
    $deletedRole->delete();

    $deletedTicket = Ticket::factory()->create(['title' => 'Deleted Ticket']);
    $deletedTicket->delete();

    $deletedAsset = Asset::factory()->create(['title' => 'Deleted Asset']);
    $deletedAsset->delete();

    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data', 1)
            ->where('deletedUsers.data.0.id', $deletedUser->id)
            ->has('deletedRoles.data', 1)
            ->where('deletedRoles.data.0.id', $deletedRole->id)
            ->has('deletedTickets.data', 1)
            ->where('deletedTickets.data.0.id', $deletedTicket->id)
            ->has('deletedAssets.data', 1)
            ->where('deletedAssets.data.0.id', $deletedAsset->id)
        );
});

test('trash index does not show active items', function () {
    User::factory()->create(['name' => 'Active User']);
    Role::create(['name' => 'Active Role']);
    Ticket::factory()->create(['title' => 'Active Ticket']);
    Asset::factory()->create(['title' => 'Active Asset']);

    get(route('trash.index'))
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data', 0)
            ->has('deletedRoles.data', 0)
            ->has('deletedTickets.data', 0)
            ->has('deletedAssets.data', 0)
        );
});

test('can search deleted users by name', function () {
    $u1 = User::factory()->create(['name' => 'John Doe']);
    $u1->delete();
    $u2 = User::factory()->create(['name' => 'Jane Smith']);
    $u2->delete();

    get(route('trash.index', ['search' => 'John']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data', 1)
            ->where('deletedUsers.data.0.name', 'John Doe')
        );
});

test('can search deleted users by email', function () {
    $u1 = User::factory()->create(['email' => 'john@example.com']);
    $u1->delete();
    $u2 = User::factory()->create(['email' => 'jane@example.com']);
    $u2->delete();

    get(route('trash.index', ['search' => 'john@']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data', 1)
            ->where('deletedUsers.data.0.email', 'john@example.com')
        );
});

test('can search deleted tickets by title', function () {
    $t1 = Ticket::factory()->create(['title' => 'Printer Issue']);
    $t1->delete();
    $t2 = Ticket::factory()->create(['title' => 'Network Problem']);
    $t2->delete();

    get(route('trash.index', ['search' => 'Printer']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedTickets.data', 1)
            ->where('deletedTickets.data.0.title', 'Printer Issue')
        );
});

test('index loads users with relationships', function () {
    $user = User::factory()->create();
    $user->delete();

    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data.0.avatar')
            ->has('deletedUsers.data.0.roles')
            ->has('deletedUsers.data.0.tickets_count')
        );
});

test('index loads tickets with relationships', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedTickets.data.0.user')
            ->has('deletedTickets.data.0.status')
            ->has('deletedTickets.data.0.priority')
            ->has('deletedTickets.data.0.category')
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

test('can restore a single role', function () {
    $role = Role::create(['name' => 'Test Role']);
    $role->delete();

    put(route('trash.restore', ['type' => 'role', 'id' => $role->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted('roles', ['id' => $role->id]);
});

test('can restore a single ticket', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    put(route('trash.restore', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted($ticket);
});

test('can restore a single asset', function () {
    $asset = Asset::factory()->create();
    $asset->delete();

    put(route('trash.restore', ['type' => 'asset', 'id' => $asset->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted($asset);
});

test('restore returns 404 if item not found', function () {
    put(route('trash.restore', ['type' => 'user', 'id' => 99999]))
        ->assertStatus(404);
});

test('restore returns 404 for unknown type', function () {
    $user = User::factory()->create();
    $user->delete();

    put(route('trash.restore', ['type' => 'unknown', 'id' => $user->id]))
        ->assertStatus(404);
});

test('can permanently delete a single user', function () {
    $user = User::factory()->create();
    $user->delete();

    delete(route('trash.force-delete', ['type' => 'user', 'id' => $user->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($user);
});

test('can permanently delete a single role', function () {
    $role = Role::create(['name' => 'Test Role']);
    $role->delete();

    delete(route('trash.force-delete', ['type' => 'role', 'id' => $role->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('roles', ['id' => $role->id]);
});

test('can permanently delete a single ticket', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    delete(route('trash.force-delete', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($ticket);
});

test('can permanently delete a single asset', function () {
    $asset = Asset::factory()->create();
    $asset->delete();

    delete(route('trash.force-delete', ['type' => 'asset', 'id' => $asset->id]))
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertModelMissing($asset);
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

test('can bulk restore multiple tickets', function () {
    $tickets = Ticket::factory()->count(3)->create();
    foreach ($tickets as $ticket) $ticket->delete();

    $idsToRestore = $tickets->take(2)->pluck('id')->toArray();

    post(route('trash.bulk-restore'), [
        'type' => 'ticket',
        'ids' => $idsToRestore
    ])->assertRedirect()->assertSessionHas('success');

    foreach ($idsToRestore as $id) {
        $this->assertNotSoftDeleted('tickets', ['id' => $id]);
    }
});

test('can bulk restore multiple assets', function () {
    $assets = Asset::factory()->count(2)->create();
    foreach ($assets as $asset) $asset->delete();

    $ids = $assets->pluck('id')->toArray();

    post(route('trash.bulk-restore'), [
        'type' => 'asset',
        'ids' => $ids
    ])->assertRedirect()->assertSessionHas('success');

    foreach ($ids as $id) {
        $this->assertNotSoftDeleted('assets', ['id' => $id]);
    }
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

test('can bulk force delete multiple roles', function () {
    $roles = collect([
        Role::create(['name' => 'Role 1']),
        Role::create(['name' => 'Role 2'])
    ]);
    foreach ($roles as $role) $role->delete();

    $ids = $roles->pluck('id')->toArray();

    post(route('trash.bulk-force-delete'), [
        'type' => 'role',
        'ids' => $ids
    ])->assertRedirect()->assertSessionHas('success');

    foreach ($ids as $id) {
        $this->assertDatabaseMissing('roles', ['id' => $id]);
    }
});

test('can bulk force delete multiple tickets', function () {
    $tickets = Ticket::factory()->count(2)->create();
    foreach ($tickets as $ticket) $ticket->delete();

    $ids = $tickets->pluck('id')->toArray();

    post(route('trash.bulk-force-delete'), [
        'type' => 'ticket',
        'ids' => $ids
    ])->assertRedirect()->assertSessionHas('success');

    foreach ($ids as $id) {
        $this->assertDatabaseMissing('tickets', ['id' => $id]);
    }
});

test('can bulk force delete multiple assets', function () {
    $assets = Asset::factory()->count(2)->create();
    foreach ($assets as $asset) $asset->delete();

    $ids = $assets->pluck('id')->toArray();

    post(route('trash.bulk-force-delete'), [
        'type' => 'asset',
        'ids' => $ids
    ])->assertRedirect()->assertSessionHas('success');

    foreach ($ids as $id) {
        $this->assertDatabaseMissing('assets', ['id' => $id]);
    }
});

test('user without view permission cannot see trash', function () {
    $user = User::factory()->create();
    actingAs($user);

    get(route('trash.index'))
        ->assertForbidden();
});

test('user without restore items permission cannot restore single item', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash');
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $ticket->delete();

    put(route('trash.restore', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertForbidden();
});

test('user without force delete items permission cannot delete single item', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash');
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $ticket->delete();

    delete(route('trash.force-delete', ['type' => 'ticket', 'id' => $ticket->id]))
        ->assertForbidden();
});

test('user without restore trash permission cannot bulk restore', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash');
    actingAs($user);

    $users = User::factory()->count(2)->create();
    foreach ($users as $u) $u->delete();

    post(route('trash.bulk-restore'), [
        'type' => 'user',
        'ids' => $users->pluck('id')->toArray()
    ])->assertForbidden();
});

test('user without force delete trash permission cannot bulk delete', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash');
    actingAs($user);

    $users = User::factory()->count(2)->create();
    foreach ($users as $u) $u->delete();

    post(route('trash.bulk-force-delete'), [
        'type' => 'user',
        'ids' => $users->pluck('id')->toArray()
    ])->assertForbidden();
});

test('user without manage settings permission cannot update retention', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view trash');
    actingAs($user);

    post(route('trash.update-retention'), [
        'type' => 'ticket',
        'days' => 60
    ])->assertForbidden();
});

test('can update retention settings', function () {
    post(route('trash.update-retention'), [
        'type' => 'ticket',
        'days' => 60
    ])->assertRedirect()->assertSessionHas('success');

    $this->assertDatabaseHas('trash_retentions', [
        'type' => 'ticket',
        'days' => 60
    ]);
});

test('retention settings validate type', function () {
    post(route('trash.update-retention'), [
        'type' => 'invalid',
        'days' => 30
    ])->assertSessionHasErrors('type');
});

test('retention settings validate days range', function () {
    post(route('trash.update-retention'), [
        'type' => 'ticket',
        'days' => 0
    ])->assertSessionHasErrors('days');

    post(route('trash.update-retention'), [
        'type' => 'ticket',
        'days' => 400
    ])->assertSessionHasErrors('days');
});

test('index shows default retention when not configured', function () {
    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('retentionSettings.ticket', 30)
            ->where('retentionSettings.user', 30)
            ->where('retentionSettings.role', 30)
            ->where('retentionSettings.asset', 30)
        );
});

test('index shows configured retention settings', function () {
    TrashRetention::create(['type' => 'ticket', 'days' => 90]);
    TrashRetention::create(['type' => 'user', 'days' => 60]);

    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('retentionSettings.ticket', 90)
            ->where('retentionSettings.user', 60)
            ->where('retentionSettings.role', 30)
            ->where('retentionSettings.asset', 30)
        );
});

test('retention settings are independent and persistent', function () {
    // 1. Set Ticket to 45
    post(route('trash.update-retention'), [
        'type' => 'ticket',
        'days' => 45
    ])->assertSessionHasNoErrors();

    // 2. Set User to 90
    post(route('trash.update-retention'), [
        'type' => 'user',
        'days' => 90
    ])->assertSessionHasNoErrors();

    // 3. Verify values
    $this->assertDatabaseHas('trash_retentions', ['type' => 'ticket', 'days' => 45]);
    $this->assertDatabaseHas('trash_retentions', ['type' => 'user', 'days' => 90]);
    
    // 4. Update Ticket again to 30
    post(route('trash.update-retention'), [
        'type' => 'ticket',
        'days' => 30
    ])->assertSessionHasNoErrors();

    // 5. Verify User is still 90 and Ticket is 30
    $this->assertDatabaseHas('trash_retentions', ['type' => 'ticket', 'days' => 30]);
    $this->assertDatabaseHas('trash_retentions', ['type' => 'user', 'days' => 90]);
});

test('bulk restore validates ids array', function () {
    post(route('trash.bulk-restore'), [
        'type' => 'user',
        'ids' => 'not-an-array'
    ])->assertSessionHasErrors('ids');
});

test('bulk restore validates type', function () {
    post(route('trash.bulk-restore'), [
        'type' => 'invalid',
        'ids' => [1, 2]
    ])->assertSessionHasErrors('type');
});

test('bulk force delete validates ids array', function () {
    post(route('trash.bulk-force-delete'), [
        'type' => 'user',
        'ids' => 'not-an-array'
    ])->assertSessionHasErrors('ids');
});

test('index paginates results separately', function () {
    User::factory()->count(10)->create()->each->delete();
    Ticket::factory()->count(10)->create()->each->delete();

    get(route('trash.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('deletedUsers.data', 5)
            ->has('deletedTickets.data', 5)
        );
});

test('index maintains search across pagination', function () {
    User::factory()->count(10)->create(['name' => 'Test User'])->each->delete();

    get(route('trash.index', ['search' => 'Test', 'users_page' => 2]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'Test')
            ->has('deletedUsers.data', 5)
        );
});

test('cannot perform actions on unknown types', function () {
    $user = User::factory()->create();
    $user->delete();

    put(route('trash.restore', ['type' => 'spaceship', 'id' => $user->id]))
        ->assertStatus(404);
});

test('cannot access items that are not soft deleted', function () {
    $user = User::factory()->create();

    put(route('trash.restore', ['type' => 'user', 'id' => $user->id]))
        ->assertStatus(404);
});
