<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use App\Policies\Ticket as TicketPolicy;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

uses(RefreshDatabase::class);

beforeEach(function () {
    $permissions = [
        'view tickets', 'show tickets', 'create tickets',
        'update tickets', 'delete tickets', 'restore tickets',
        'force delete tickets', 'assign tickets', 'be assigned tickets',
        'archive tickets', 'unarchive tickets'
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    Role::firstOrCreate(['name' => 'solver']);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);

    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    $this->admin->givePermissionTo(Permission::all());

    $this->solver = User::factory()->create();
    $this->solver->assignRole('solver');
    $this->solver->givePermissionTo(['view tickets', 'show tickets', 'update tickets', 'archive tickets', 'unarchive tickets']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(['view tickets', 'show tickets', 'create tickets', 'update tickets']);

    $this->otherUser = User::factory()->create();

    $this->priority = TicketPriority::create(['title' => 'High', 'color' => '#ff0000', 'sort_order' => 1]);
    $this->status = TicketStatus::create(['title' => 'New', 'color' => '#00ff00', 'sort_order' => 1, 'is_default' => true]);
    $this->category = TicketCategory::create(['title' => 'Bug', 'color' => '#0000ff', 'sort_order' => 1]);

    $this->policy = new TicketPolicy();
});

test('viewAny returns true when user has view tickets permission', function () {
    expect($this->policy->viewAny($this->admin))->toBeTrue();
    expect($this->policy->viewAny($this->user))->toBeTrue();
});

test('viewAny returns false when user lacks view tickets permission', function () {
    expect($this->policy->viewAny($this->otherUser))->toBeFalse();
});

test('view returns true for admin regardless of ticket ownership', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->otherUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->view($this->admin, $ticket))->toBeTrue();
});

test('view returns true for solver regardless of ticket ownership', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->otherUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->view($this->solver, $ticket))->toBeTrue();
});

test('view returns true for ticket author', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->view($this->user, $ticket))->toBeTrue();
});

test('view returns true for assigned user', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->otherUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $ticket->assignees()->create(['user_id' => $this->user->id]);

    expect($this->policy->view($this->user, $ticket))->toBeTrue();
});

test('view returns false for non-author non-assigned user', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->admin->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->view($this->otherUser, $ticket))->toBeFalse();
});

test('create returns true when user has create tickets permission', function () {
    expect($this->policy->create($this->admin))->toBeTrue();
    expect($this->policy->create($this->user))->toBeTrue();
});

test('create returns false when user lacks create tickets permission', function () {
    expect($this->policy->create($this->otherUser))->toBeFalse();
});

test('update returns true for admin with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->otherUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->update($this->admin, $ticket))->toBeTrue();
});

test('update returns true for solver with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->otherUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->update($this->solver, $ticket))->toBeTrue();
});

test('update returns true for ticket author with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->update($this->user, $ticket))->toBeTrue();
});

test('update returns true for assigned user with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->otherUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $ticket->assignees()->create(['user_id' => $this->user->id]);

    expect($this->policy->update($this->user, $ticket))->toBeTrue();
});

test('update returns false for non-author non-assigned user', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->admin->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->update($this->otherUser, $ticket))->toBeFalse();
});

test('delete returns true when user has delete tickets permission', function () {
    expect($this->policy->delete($this->admin))->toBeTrue();
});

test('delete returns false when user lacks delete tickets permission', function () {
    expect($this->policy->delete($this->user))->toBeFalse();
});

test('restore returns true when user has restore tickets permission', function () {
    expect($this->policy->restore($this->admin))->toBeTrue();
});

test('restore returns false when user lacks restore tickets permission', function () {
    expect($this->policy->restore($this->user))->toBeFalse();
});

test('forceDelete returns true when user has force delete tickets permission', function () {
    expect($this->policy->forceDelete($this->admin))->toBeTrue();
});

test('forceDelete returns false when user lacks force delete tickets permission', function () {
    expect($this->policy->forceDelete($this->user))->toBeFalse();
});

test('assign returns true when user has assign tickets permission', function () {
    expect($this->policy->assign($this->admin))->toBeTrue();
});

test('assign returns false when user lacks assign tickets permission', function () {
    expect($this->policy->assign($this->user))->toBeFalse();
});

test('selfAssign returns true when user has be assigned tickets permission', function () {
    $this->user->givePermissionTo('be assigned tickets');
    expect($this->policy->selfAssign($this->user))->toBeTrue();
});

test('selfAssign returns false when user lacks be assigned tickets permission', function () {
    expect($this->policy->selfAssign($this->otherUser))->toBeFalse();
});

test('archive returns true for admin with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->archive($this->admin, $ticket))->toBeTrue();
});

test('archive returns true for solver with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->archive($this->solver, $ticket))->toBeTrue();
});

test('archive returns false for regular user', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    expect($this->policy->archive($this->user, $ticket))->toBeFalse();
});

test('unarchive returns true for admin with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'archived_at' => now(),
    ]);

    expect($this->policy->unarchive($this->admin, $ticket))->toBeTrue();
});

test('unarchive returns true for solver with permission', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'archived_at' => now(),
    ]);

    expect($this->policy->unarchive($this->solver, $ticket))->toBeTrue();
});

test('unarchive returns false for regular user', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'archived_at' => now(),
    ]);

    expect($this->policy->unarchive($this->user, $ticket))->toBeFalse();
});

