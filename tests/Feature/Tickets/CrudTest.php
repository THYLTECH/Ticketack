<?php

namespace Tests\Feature\Tickets;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete, get, patch, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    $permissions = [
        'view tickets', 'show tickets', 'create tickets',
        'update tickets', 'delete tickets', 'restore tickets', 'force delete tickets'
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    Role::firstOrCreate(['name' => 'solver']);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);

    $this->user = User::factory()->create();
    $this->user->assignRole($adminRole);
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
    Storage::fake('public');

    $this->priority = TicketPriority::create(['title' => 'High', 'color' => '#ff0000', 'sort_order' => 1]);
    $this->status = TicketStatus::create(['title' => 'New', 'color' => '#00ff00', 'sort_order' => 1, 'is_default' => true]);
    $this->category = TicketCategory::create(['title' => 'Bug', 'color' => '#0000ff', 'sort_order' => 1]);
    $this->asset = Asset::factory()->create();
});

test('index page loads with pagination and filters', function () {
    Ticket::factory()->count(5)->create(['author_id' => $this->user->id]);

    get(route('tickets.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/index')
            ->has('tickets.data')
        );
});

test('index restricts view for non-admin users', function () {
    $this->user->removeRole('admin');
    Ticket::factory()->create();

    get(route('tickets.index'))
        ->assertInertia(fn ($page) => $page
            ->has('tickets.data', 0)
        );
});

test('manage page filters for assigned tickets', function () {
    $ticket = Ticket::factory()->create();
    $ticket->assignees()->create(['user_id' => $this->user->id]);

    get(route('tickets.manage'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('tickets.data', 1)
        );
});

test('create page provides all necessary metadata', function () {
    get(route('tickets.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('priorities')
            ->has('categories')
            ->has('statuses')
            ->has('assets')
            ->has('users')
        );
});

test('show page loads ticket and relations', function () {
    $ticket = Ticket::factory()->create();

    get(route('tickets.show', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('ticket.id', $ticket->id)
            ->has('events')
            ->has('solvers')
        );
});

test('edit page loads ticket data', function () {
    $ticket = Ticket::factory()->create();

    get(route('tickets.edit', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->where('ticket.id', $ticket->id));
});

test('store saves ticket and handles attachments', function () {
    $file = UploadedFile::fake()->image('debug.png');

    $data = [
        'title' => 'New Issue',
        'description' => 'Description text',
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'asset_id' => $this->asset->id,
        'is_public' => true,
        'assignees' => [['id' => $this->user->id]],
        'attachments' => [[
            'title' => 'Log',
            'file' => $file
        ]]
    ];

    post(route('tickets.store'), $data)
        ->assertRedirect(route('tickets.manage'));

    $this->assertDatabaseHas('tickets', ['title' => 'New Issue']);
    $this->assertDatabaseHas('attachments', ['file_name' => 'debug.png']);
});

test('update syncs assignees correctly', function () {
    $ticket = Ticket::factory()->create();
    $newUser = User::factory()->create();

    $data = [
        'title' => 'Updated',
        'description' => 'Updated desc',
        'priority_id' => $ticket->priority_id,
        'status_id' => $ticket->status_id,
        'category_id' => $ticket->category_id,
        'asset_id' => $ticket->asset_id,
        'assignees' => [['id' => $newUser->id]]
    ];

    put(route('tickets.update', $ticket), $data)
        ->assertRedirect(route('tickets.show', $ticket));

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $newUser->id
    ]);
});

test('soft delete, restore and force delete workflow', function () {
    $ticket = Ticket::factory()->create();

    delete(route('tickets.destroy', $ticket))
        ->assertRedirect(route('tickets.manage'));
    $this->assertSoftDeleted('tickets', ['id' => $ticket->id]);

    post(route('tickets.restore', $ticket))
        ->assertRedirect();
    $this->assertNotSoftDeleted('tickets', ['id' => $ticket->id]);

    $ticket->delete();
    delete(route('tickets.force_delete', $ticket))
        ->assertRedirect(route('tickets.manage'));
    $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
});
