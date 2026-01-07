<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, patch};

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    actingAs($this->user);
});

test('user can save categories', function () {
    $data = [
        'categories' => [
            [
                'id' => null,
                'title' => 'Network Issue',
                'description' => 'Wifi and LAN problems',
                'color' => '#123456',
                'icon' => 'wifi'
            ]
        ]
    ];

    patch(route('tickets.categories.save'), $data)
        ->assertSessionHasNoErrors()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_categories', ['title' => 'Network Issue']);
});

test('cannot delete a category attached to a ticket', function () {
    $category = TicketCategory::create(['title' => 'Used Category', 'color' => '#000', 'sort_order' => 1]);
    Ticket::factory()->create(['category_id' => $category->id]);

    patch(route('tickets.categories.save'), ['categories' => []])
        ->assertSessionHasErrors('categories');

    $this->assertDatabaseHas('ticket_categories', ['id' => $category->id]);
});

test('statuses logic enforces exactly one default and one closed status', function () {
    $data = [
        'statuses' => [
            [
                'id' => 1,
                'title' => 'Open',
                'color' => '#ffffff',
                'is_default' => true,
                'is_closed' => false
            ],
            [
                'id' => 2,
                'title' => 'Closed',
                'color' => '#000000',
                'is_default' => false,
                'is_closed' => true
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasNoErrors();
});

test('statuses validation fails if no default status defined', function () {
    $data = [
        'statuses' => [
            [
                'id' => 1,
                'title' => 'Just a status',
                'color' => '#ffffff',
                'is_default' => false,
                'is_closed' => true
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasErrors('statuses');
});

test('user can save priorities', function () {
    $data = [
        'priorities' => [
            [
                'id' => null,
                'title' => 'Urgent',
                'description' => 'Drop everything',
                'color' => '#ff0000'
            ]
        ]
    ];

    patch(route('tickets.priorities.save'), $data)
        ->assertSessionHasNoErrors()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_priorities', ['title' => 'Urgent']);
});

test('cannot delete a priority attached to a ticket', function () {
    $priority = TicketPriority::create(['title' => 'Used Priority', 'color' => '#000', 'sort_order' => 1]);
    Ticket::factory()->create(['priority_id' => $priority->id]);

    patch(route('tickets.priorities.save'), ['priorities' => []])
        ->assertSessionHasErrors('priorities');

    $this->assertDatabaseHas('ticket_priorities', ['id' => $priority->id]);
});

test('statuses validation fails if no closed status defined', function () {
    $data = [
        'statuses' => [
            [
                'id' => 1,
                'title' => 'Open',
                'color' => '#ffffff',
                'is_default' => true,
                'is_closed' => false
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasErrors('statuses');
});

test('deleting a status reassigns tickets to the default status', function () {
    $defaultStatus = TicketStatus::create([
        'title' => 'Open',
        'color' => '#000000',
        'is_default' => true,
        'is_closed' => false,
        'sort_order' => 1
    ]);

    $closedStatus = TicketStatus::create([
        'title' => 'Closed',
        'color' => '#000000',
        'is_default' => false,
        'is_closed' => true,
        'sort_order' => 3
    ]);

    $statusToDelete = TicketStatus::create([
        'title' => 'To Delete',
        'color' => '#ff0000',
        'is_default' => false,
        'is_closed' => false,
        'sort_order' => 2
    ]);

    $ticket = Ticket::factory()->create(['status_id' => $statusToDelete->id]);

    $data = [
        'statuses' => [
            [
                'id' => $defaultStatus->id,
                'title' => $defaultStatus->title,
                'color' => $defaultStatus->color,
                'is_default' => true,
                'is_closed' => false
            ],
            [
                'id' => $closedStatus->id,
                'title' => $closedStatus->title,
                'color' => $closedStatus->color,
                'is_default' => false,
                'is_closed' => true
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasNoErrors();

    $ticket->refresh();

    expect($ticket->status_id)->toBe($defaultStatus->id);

    $this->assertDatabaseMissing('ticket_statuses', ['id' => $statusToDelete->id]);
});

test('saving statuses creates a new default status if needed', function () {
    \App\Models\TicketStatus::query()->delete();

    $data = [
        'statuses' => [
            [
                'id' => null,
                'title' => 'New Default',
                'description' => 'Created automatically',
                'color' => '#000000',
                'is_default' => true,
                'is_closed' => false
            ],
            [
                'id' => null,
                'title' => 'Closed',
                'color' => '#000000',
                'is_default' => false,
                'is_closed' => true
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('ticket_statuses', ['title' => 'New Default']);
});

test('cannot delete a status that is locked', function () {
    $lockedStatus = TicketStatus::create([
        'title' => 'Locked Status',
        'color' => '#ff0000',
        'is_default' => false,
        'is_closed' => false,
        'locked' => true,
        'sort_order' => 1
    ]);

    $defaultStatus = TicketStatus::create([
        'title' => 'Open',
        'color' => '#000000',
        'is_default' => true,
        'is_closed' => false,
        'locked' => false,
        'sort_order' => 0
    ]);

    $closedStatus = TicketStatus::create([
        'title' => 'Closed',
        'color' => '#000000',
        'is_default' => false,
        'is_closed' => true,
        'locked' => false,
        'sort_order' => 2
    ]);

    $data = [
        'statuses' => [
            [
                'id' => $defaultStatus->id,
                'title' => $defaultStatus->title,
                'color' => $defaultStatus->color,
                'is_default' => true,
                'is_closed' => false
            ],
            [
                'id' => $closedStatus->id,
                'title' => $closedStatus->title,
                'color' => $closedStatus->color,
                'is_default' => false,
                'is_closed' => true
            ]
        ]
    ];

    patch(route('tickets.statuses.save'), $data)
        ->assertSessionHasErrors('statuses');

    $this->assertDatabaseHas('ticket_statuses', ['id' => $lockedStatus->id]);
});

test('cannot delete a priority that is locked', function () {
    $lockedPriority = TicketPriority::create([
        'title' => 'Locked Priority',
        'color' => '#ff0000',
        'locked' => true,
        'sort_order' => 1
    ]);

    $normalPriority = TicketPriority::create([
        'title' => 'Normal Priority',
        'color' => '#00ff00',
        'locked' => false,
        'sort_order' => 2
    ]);

    $data = [
        'priorities' => [
            [
                'id' => $normalPriority->id,
                'title' => $normalPriority->title,
                'description' => $normalPriority->description,
                'color' => $normalPriority->color
            ]
        ]
    ];

    patch(route('tickets.priorities.save'), $data)
        ->assertSessionHasErrors('priorities');

    $this->assertDatabaseHas('ticket_priorities', ['id' => $lockedPriority->id]);
});
