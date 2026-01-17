<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, put, post};
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $permissions = [
        'view tickets', 'show tickets', 'create tickets',
        'update tickets', 'delete tickets', 'restore tickets', 'force delete tickets', 'be assigned tickets',
        'view ticket entries'
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    $role = Role::firstOrCreate(['name' => 'solver']);
    $role->givePermissionTo($permissions);

    $this->user = User::factory()->create();
    $this->user->assignRole($role);
    
    actingAs($this->user);
});

test('cannot update an archived ticket', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'archived_at' => now(),
    ]);

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'priority_id' => $ticket->priority_id,
        'category_id' => $ticket->category_id,
        'status_id' => $ticket->status_id,
    ];

    put(route('tickets.update', $ticket), $data)
        ->assertForbidden();
});

test('cannot add time entry to an archived ticket', function () {
    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'archived_at' => now(),
    ]);

    $data = [
        'ticket_id' => $ticket->id,
        'date' => now()->subDay()->format('Y-m-d'),
        'hours' => 1,
        'minutes' => 0,
        'description' => 'Test entry',
    ];

    post(route('tickets.entries.store'), $data)
        ->assertForbidden(); 
});
