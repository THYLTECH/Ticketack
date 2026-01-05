<?php

namespace Tests\Feature\Tickets;

use App\Models\Asset;
use App\Models\Attachment;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete, get, post, put};

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
    $this->asset = Asset::factory()->create(['title' => 'Laptop']);
});

test('index page loads with pagination and filters', function () {
    Ticket::factory()->count(5)->create(['author_id' => $this->user->id]);

    get(route('tickets.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/index')
            ->has('tickets.data', 5)
            ->has('filters')
            ->has('solvers')
        );
});

test('index restricts view for non-admin/non-solver users', function () {
    $this->user->removeRole('admin');

    $otherUser = User::factory()->create();
    Ticket::factory()->create(['author_id' => $otherUser->id]);

    get(route('tickets.index'))
        ->assertInertia(fn ($page) => $page
            ->has('tickets.data', 0)
        );
});

test('manage page filters for assigned tickets for non-admins', function () {
    $ticket = Ticket::factory()->create();
    $ticket->assignees()->create(['user_id' => $this->user->id]);

    get(route('tickets.manage'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/manage')
            ->has('tickets.data', 1)
        );

    $this->user->removeRole('admin');
    $this->user->assignRole('solver');

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
            ->component('tickets/create')
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
            ->component('tickets/show')
            ->where('ticket.id', $ticket->id)
            ->has('events')
            ->has('solvers')
        );
});

test('edit page loads ticket data', function () {
    $ticket = Ticket::factory()->create();

    get(route('tickets.edit', $ticket))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/edit')
            ->where('ticket.id', $ticket->id)
        );
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
        'is_referenced' => false,
        'assignees' => [['id' => $this->user->id]],
        'attachments' => [$file]
    ];

    post(route('tickets.store'), $data)
        ->assertRedirect(route('tickets.manage'));

    $this->assertDatabaseHas('tickets', [
        'title' => 'New Issue',
        'author_id' => $this->user->id
    ]);

    $this->assertDatabaseHas('attachments', [
        'file_name' => 'debug.png',
        'title' => 'debug.png'
    ]);

    $ticket = Ticket::where('title', 'New Issue')->first();
    $this->assertDatabaseHas('ticket_attachments', ['ticket_id' => $ticket->id]);
    $this->assertDatabaseHas('ticket_assignees', ['ticket_id' => $ticket->id, 'user_id' => $this->user->id]);
});
test('update syncs assignees correctly', function () {
    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $newUser = User::factory()->create();

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'asset_id' => $this->asset->id,
        'is_public' => false,
        'is_referenced' => true,
        'assignees' => [['id' => $newUser->id]]
    ];

    put(route('tickets.update', $ticket), $data)
        ->assertRedirect(route('tickets.show', $ticket));

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $newUser->id
    ]);

    $this->assertDatabaseHas('tickets', [
        'id' => $ticket->id,
        'title' => 'Updated Title',
        'is_referenced' => true
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

test('it prevents adding more than 10 attachments on update', function () {
    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ]);

    for ($i = 0; $i < 10; $i++) {
        $attachment = Attachment::create([
            'title' => "file$i.png",
            'file_name' => "file$i.png",
            'file_path' => "path/file$i.png",
            'mime_type' => 'image/png',
            'file_extension' => 'png',
            'file_size' => 1024,
        ]);

        TicketAttachment::create([
            'ticket_id' => $ticket->id,
            'attachment_id' => $attachment->id,
        ]);
    }

    $file = UploadedFile::fake()->image('extra.png');

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'asset_id' => $this->asset->id,
        'is_public' => false,
        'is_referenced' => true,
        'assignees' => [['id' => $this->user->id]],
        'attachments' => [$file]
    ];

    put(route('tickets.update', $ticket), $data)
        ->assertSessionHasErrors();
});

test('it can save a ticket without status and asset', function () {
    $data = [
        'title' => 'Minimal Ticket',
        'description' => 'Only required fields',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'status_id' => null,
        'asset_id' => null,
    ];

    post(route('tickets.store'), $data)
        ->assertRedirect(route('tickets.manage'));

    $this->assertDatabaseHas('tickets', [
        'title' => 'Minimal Ticket',
        'status_id' => $this->status->id,
        'asset_id' => null,
    ]);
});

test('index and manage queries apply search filters correctly', function () {
    Ticket::factory()->create(['title' => 'Target Ticket', 'author_id' => $this->user->id]);
    Ticket::factory()->create(['title' => 'Other', 'author_id' => $this->user->id]);

    get(route('tickets.index', ['search' => 'Target']))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));

    get(route('tickets.index', ['status' => $this->status->id]))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 2));

    $ticket = Ticket::first();
    $ticket->assignees()->create(['user_id' => $this->user->id]);
    get(route('tickets.index', ['assignee' => $this->user->id]))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));
});

test('index and manage queries apply date range filters', function () {
    Ticket::factory()->create(['updated_at' => now()->subDays(10), 'author_id' => $this->user->id]);

    get(route('tickets.index', [
        'date_from' => now()->subDays(1)->format('Y-m-d'),
        'date_to' => now()->addDays(1)->format('Y-m-d')
    ]))->assertInertia(fn ($page) => $page->has('tickets.data', 0));
});

test('store and update handle requests without assignees or attachments', function () {
    $data = [
        'title' => 'Simple Ticket',
        'description' => 'No extras',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ];

    post(route('tickets.store'), $data)->assertRedirect(route('tickets.manage'));

    $ticket = Ticket::where('title', 'Simple Ticket')->first();
    expect($ticket->assignees)->toBeEmpty()
        ->and($ticket->attachments)->toBeEmpty();

    // Test Update sans changer les assignés
    put(route('tickets.update', $ticket), array_merge($data, ['title' => 'Updated Simple']))
        ->assertRedirect(route('tickets.show', $ticket));
});

test('update handles file uploads correctly', function () {
    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ]);

    $file = UploadedFile::fake()->image('update_test.jpg');

    $data = [
        'title' => 'Update with File',
        'description' => 'Adding a file',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'attachments' => [$file]
    ];

    put(route('tickets.update', $ticket), $data)->assertRedirect(route('tickets.show', $ticket));

    $this->assertDatabaseHas('attachments', ['file_name' => 'update_test.jpg']);
});

test('it uses default sorting if allowedSorts is invalid', function () {
    Ticket::factory()->count(2)->create(['author_id' => $this->user->id]);

    get(route('tickets.index', ['sort' => 'illegal_column', 'direction' => 'asc']))
        ->assertOk();
});

test('non-admin solver can only see their assigned tickets in manage', function () {
    $this->user->removeRole('admin');
    $this->user->assignRole('solver');

    $myTicket = Ticket::factory()->create();
    $myTicket->assignees()->create(['user_id' => $this->user->id]);

    Ticket::factory()->create();

    get(route('tickets.manage'))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));
});
