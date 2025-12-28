<?php

namespace Tests\Feature\Tickets;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketAssignee;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete, get, patch, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    // Setup Permissions & Roles
    $permissions = [
        'view tickets', 'show tickets', 'create tickets',
        'update tickets', 'delete tickets', 'restore tickets', 'force delete tickets'
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    // Creating BOTH roles required by the controller logic
    Role::firstOrCreate(['name' => 'solver']);
    $role = Role::firstOrCreate(['name' => 'admin']); // <-- Added 'admin' role creation

    $this->user = User::factory()->create();
    $this->user->assignRole($role);
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
    Storage::fake('public');

    // Seed basic data needed for dropdowns
    $this->priority = TicketPriority::create(['title' => 'High', 'color' => '#ff0000', 'sort_order' => 1]);
    $this->status = TicketStatus::create(['title' => 'New', 'color' => '#00ff00', 'sort_order' => 1, 'is_default' => true]);
    $this->category = TicketCategory::create(['title' => 'Bug', 'color' => '#0000ff', 'sort_order' => 1]);
    $this->asset = Asset::factory()->create();
});

test('index page loads and shows assigned tickets', function () {
    $tickets = Ticket::factory()->count(3)->create();

    foreach ($tickets as $ticket) {
        TicketAssignee::create([
            'ticket_id' => $ticket->id,
            'user_id' => $this->user->id
        ]);
    }

    get(route('tickets.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/index') // Ensure this matches your file case (e.g. Tickets/Index)
            ->has('tickets', 3)
        );
});

test('manage page loads', function () {
    get(route('tickets.manage'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('tickets/manage'));
});

test('create page loads with necessary props', function () {
    get(route('tickets.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/create')
            ->has('priorities')
            ->has('categories')
            ->has('statuses')
            ->has('assets')
            ->has('users')
        );
});

test('show page loads with ticket, events and solvers', function () {
    $ticket = Ticket::factory()->create();

    // Create a schedule to verify it loads in 'events'
    TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60
    ]);

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/show')
            ->where('ticket.id', $ticket->id)
            ->has('events', 1)
            ->has('solvers')
        );
});

test('store creates a new ticket with attachments and assignees', function () {
    $file = UploadedFile::fake()->image('issue.jpg');
    $otherUser = User::factory()->create();

    $data = [
        'title' => 'Critical Bug',
        'description' => 'System crash details',
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'asset_id' => $this->asset->id,
        'assignees' => [
            ['id' => $this->user->id],
            ['id' => $otherUser->id]
        ],
        'attachments' => [[
            'title' => 'Screenshot',
            'file' => $file
        ]]
    ];

    post(route('tickets.store'), $data)
        ->assertRedirect(route('tickets.manage'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('tickets', ['title' => 'Critical Bug']);
    $ticket = Ticket::where('title', 'Critical Bug')->first();

    $this->assertDatabaseHas('ticket_assignees', ['ticket_id' => $ticket->id, 'user_id' => $this->user->id]);
    $this->assertDatabaseHas('ticket_assignees', ['ticket_id' => $ticket->id, 'user_id' => $otherUser->id]);

    $this->assertDatabaseHas('attachments', ['file_name' => 'issue.jpg']);
    $this->assertDatabaseHas('ticket_attachments', ['ticket_id' => $ticket->id]);
});

test('store validation fails for invalid data', function () {
    post(route('tickets.store'), [])
        ->assertSessionHasErrors(['title', 'priority_id', 'category_id', 'status_id', 'asset_id']);
});

test('update modifies ticket and syncs assignees', function () {
    $ticket = Ticket::factory()->create();
    TicketAssignee::create(['ticket_id' => $ticket->id, 'user_id' => $this->user->id]);

    $newUser = User::factory()->create();

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated Description',
        'priority_id' => $ticket->priority_id,
        'status_id' => $ticket->status_id,
        'category_id' => $ticket->category_id,
        'asset_id' => $ticket->asset_id,
        'assignees' => [
            ['id' => $newUser->id]
        ]
    ];

    patch(route('tickets.update', $ticket), $data)
        ->assertRedirect(route('tickets.show', $ticket));

    $this->assertDatabaseHas('tickets', ['id' => $ticket->id, 'title' => 'Updated Title']);
    $this->assertDatabaseMissing('ticket_assignees', ['ticket_id' => $ticket->id, 'user_id' => $this->user->id]);
    $this->assertDatabaseHas('ticket_assignees', ['ticket_id' => $ticket->id, 'user_id' => $newUser->id]);
});

test('soft delete works', function () {
    $ticket = Ticket::factory()->create();

    delete(route('tickets.destroy', $ticket))
        ->assertRedirect(route('tickets.manage'));

    $this->assertSoftDeleted('tickets', ['id' => $ticket->id]);
});

test('restore works', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    post(route('tickets.restore', $ticket))
        ->assertRedirect();

    $this->assertNotSoftDeleted('tickets', ['id' => $ticket->id]);
});

test('force delete works', function () {
    $ticket = Ticket::factory()->create();
    $ticket->delete();

    delete(route('tickets.force_delete', $ticket))
        ->assertRedirect(route('tickets.manage'));

    $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
});
