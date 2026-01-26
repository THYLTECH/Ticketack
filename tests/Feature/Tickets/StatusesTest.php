<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketStatus;
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

test('can create and update statuses', function () {
    $data = [
        'statuses' => [
            [
                'id' => null,
                'title' => 'New',
                'description' => 'Just created',
                'color' => '#00ff00',
                'is_default' => true,
                'is_closed' => false,
            ],
            [
                'id' => null,
                'title' => 'Done',
                'description' => 'Finished',
                'color' => '#ff0000',
                'is_default' => false,
                'is_closed' => true,
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_statuses', ['title' => 'New', 'is_default' => true]);
    $this->assertDatabaseHas('ticket_statuses', ['title' => 'Done', 'is_closed' => true]);
});

test('must have exactly one default status', function () {
    $data = [
        'statuses' => [
            [
                'id' => null,
                'title' => 'Open',
                'color' => '#000000',
                'is_default' => false, // No default
                'is_closed' => true,
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasErrors(['statuses']);
});

test('must have exactly one closed status', function () {
    $data = [
        'statuses' => [
            [
                'id' => null,
                'title' => 'Open',
                'color' => '#000000',
                'is_default' => true,
                'is_closed' => false,
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasErrors(['statuses']);
});

test('migrates tickets when deleting status', function () {
    $statusToDelete = TicketStatus::create([
        'title' => 'To Delete',
        'color' => '#000000',
        'is_default' => false,
        'is_closed' => false,
        'sort_order' => 2
    ]);

    $defaultStatus = TicketStatus::create([
        'title' => 'Default',
        'color' => '#111111',
        'is_default' => true,
        'is_closed' => false,
        'sort_order' => 0
    ]);
    
    TicketStatus::create([
        'title' => 'Closed',
        'color' => '#222222',
        'is_default' => false,
        'is_closed' => true,
        'sort_order' => 1
    ]);

    $ticket = Ticket::factory()->create(['status_id' => $statusToDelete->id]);

    $data = [
        'statuses' => [
            [
                'id' => $defaultStatus->id,
                'title' => 'Default',
                'color' => '#111111',
                'is_default' => true,
                'is_closed' => false,
            ],
            [
               'id' => null,
               'title' => 'Closed',
                'color' => '#222222',
                'is_default' => false,
                'is_closed' => true,
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('ticket_statuses', ['id' => $statusToDelete->id]);
    expect($ticket->fresh()->status_id)->toBe($defaultStatus->id);
});

test('cannot delete locked status', function () {
    $locked = TicketStatus::create([
        'title' => 'Locked',
        'color' => '#000000',
        'is_default' => false,
        'is_closed' => false,
        'sort_order' => 1,
        'locked' => true
    ]);
    
    // Create necessary default/closed statuses for validation
    $default = TicketStatus::create(['title' => 'D', 'color' => '#ffffff', 'is_default' => true, 'is_closed' => false, 'sort_order' => 0]);
    $closed = TicketStatus::create(['title' => 'C', 'color' => '#000000', 'is_default' => false, 'is_closed' => true, 'sort_order' => 2]);

    $data = [
        'statuses' => [
            ['id' => $default->id, 'title' => 'D', 'color' => '#ffffff', 'is_default' => true, 'is_closed' => false],
            ['id' => $closed->id, 'title' => 'C', 'color' => '#000000', 'is_default' => false, 'is_closed' => true],
            // Locked status omitted implies deletion attempt
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasErrors(['statuses']);

    $this->assertDatabaseHas('ticket_statuses', ['id' => $locked->id]);
});
