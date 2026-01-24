<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, patch};

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    $role = Role::create(['name' => 'admin']);
    $this->user->assignRole($role);
    actingAs($this->user);
});

test('can create and update categories', function () {
    $data = [
        'categories' => [
            [
                'id' => null,
                'title' => 'Feature Request',
                'description' => 'New features',
                'color' => '#00ff00',
                'icon' => 'star',
            ],
            [
                'id' => null,
                'title' => 'Bug Report',
                'description' => 'Errors',
                'color' => '#ff0000',
                'icon' => 'bug',
            ]
        ]
    ];

    patch(route('tickets.categories.save'), $data)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_categories', ['title' => 'Feature Request', 'sort_order' => 0]);
    $this->assertDatabaseHas('ticket_categories', ['title' => 'Bug Report', 'sort_order' => 1]);
});

test('can delete unused category', function () {
    $category = TicketCategory::create([
        'title' => 'To Delete',
        'color' => '#000000',
        'sort_order' => 1
    ]);

    $data = [
        'categories' => []
    ];

    patch(route('tickets.categories.save'), $data)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('ticket_categories', ['id' => $category->id]);
});

test('cannot delete category with attached tickets', function () {
    $category = TicketCategory::create([
        'title' => 'Attached',
        'color' => '#000000',
        'sort_order' => 1
    ]);

    Ticket::factory()->create(['category_id' => $category->id]);

    $data = [
        'categories' => []
    ];

    patch(route('tickets.categories.save'), $data)
        ->assertSessionHasErrors(['categories']);

    $this->assertDatabaseHas('ticket_categories', ['id' => $category->id]);
});

test('updates sort order correctly', function () {
    $cat1 = TicketCategory::create(['title' => 'First', 'color' => '#111111', 'sort_order' => 0]);
    $cat2 = TicketCategory::create(['title' => 'Second', 'color' => '#222222', 'sort_order' => 1]);

    $data = [
        'categories' => [
            [
                'id' => $cat2->id,
                'title' => 'Second',
                'description' => null,
                'color' => '#222222',
                'icon' => null,
            ],
            [
                'id' => $cat1->id,
                'title' => 'First',
                'description' => null,
                'color' => '#111111',
                'icon' => null,
            ]
        ]
    ];

    patch(route('tickets.categories.save'), $data)
        ->assertRedirect();

    expect($cat2->fresh()->sort_order)->toBe(0)
        ->and($cat1->fresh()->sort_order)->toBe(1);
});
