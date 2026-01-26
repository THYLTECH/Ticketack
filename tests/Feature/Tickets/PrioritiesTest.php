<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketPriority;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, patch};

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);
    $this->user->assignRole($role);
    actingAs($this->user);
});

test('can create and update priorities', function () {
    $data = [
        'priorities' => [
            [
                'id' => null,
                'title' => 'Critical',
                'description' => 'Drop everything',
                'color' => '#ff0000',
            ],
            [
                'id' => null,
                'title' => 'Low',
                'description' => 'Whenever',
                'color' => '#00ff00',
            ]
        ]
    ];

    patch(route('tickets.priorities.save'), $data)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_priorities', ['title' => 'Critical', 'sort_order' => 0]);
    $this->assertDatabaseHas('ticket_priorities', ['title' => 'Low', 'sort_order' => 1]);
});

test('can delete unused priority', function () {
    $priority = TicketPriority::create([
        'title' => 'To Delete',
        'color' => '#000000',
        'sort_order' => 1
    ]);

    $data = [
        'priorities' => []
    ];

    patch(route('tickets.priorities.save'), $data)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('ticket_priorities', ['id' => $priority->id]);
});

test('cannot delete priority with attached tickets', function () {
    $priority = TicketPriority::create([
        'title' => 'Attached',
        'color' => '#000000',
        'sort_order' => 1
    ]);

    Ticket::factory()->create(['priority_id' => $priority->id]);

    $data = [
        'priorities' => []
    ];

    patch(route('tickets.priorities.save'), $data)
        ->assertSessionHasErrors(['priorities']);

    $this->assertDatabaseHas('ticket_priorities', ['id' => $priority->id]);
});

test('cannot delete locked priority', function () {
    $priority = TicketPriority::create([
        'title' => 'Locked',
        'color' => '#000000',
        'sort_order' => 1,
        'locked' => true
    ]);

    $data = [
        'priorities' => []
    ];

    patch(route('tickets.priorities.save'), $data)
        ->assertSessionHasErrors(['priorities']);

    $this->assertDatabaseHas('ticket_priorities', ['id' => $priority->id]);
});
