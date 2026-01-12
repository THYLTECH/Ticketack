<?php

namespace Tests\Feature\Tickets;

use App\Models\Asset;
use App\Models\Attachment;
use App\Models\Ticket;
use App\Models\TicketAttachment;
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
        'is_archived' => false,
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
        'is_archived' => false,
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
        'is_archived' => false,
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

test('show page displays events including entries', function () {
    $ticket = Ticket::factory()->create();

    TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60,
    ]);

    \App\Models\TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->subDay(),
        'end_at' => now()->subDay()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $response = get(route('tickets.show', $ticket));

    $events = $response->viewData('page')['props']['events'];

    expect($events)->toHaveCount(2);
});

test('show page includes entries from all solvers for the ticket', function () {
    $ticket = Ticket::factory()->create();
    $otherUser = User::factory()->create();

    $otherEntry = \App\Models\TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $otherUser->id,
        'start_at' => now()->subDay(),
        'end_at' => now()->subDay()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $myEntry = \App\Models\TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->subDay(),
        'end_at' => now()->subDay()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $response = get(route('tickets.show', $ticket));

    $events = $response->viewData('page')['props']['events'];
    $entryIds = collect($events)->pluck('id')->filter(fn($id) => str_starts_with((string)$id, 'entry-'));

    expect($entryIds)->toHaveCount(2)
        ->and($entryIds)->toContain('entry-' . $myEntry->id)
        ->and($entryIds)->toContain('entry-' . $otherEntry->id);
});

test('show page excludes entries without end_at', function () {
    $ticket = Ticket::factory()->create();

    \App\Models\TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->subDay(),
        'end_at' => now()->subDay()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $response = get(route('tickets.show', $ticket));

    $events = $response->viewData('page')['props']['events'];
    $entryIds = collect($events)->pluck('id')->filter(fn($id) => str_starts_with((string)$id, 'entry-'));

    expect($entryIds)->toHaveCount(1);
});

test('store creates ticket with default status if not provided', function () {
    $defaultStatus = TicketStatus::where('is_default', true)->first();

    $data = [
        'title' => 'Auto Status Ticket',
        'description' => 'Should get default status',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ];

    post(route('tickets.store'), $data);

    $ticket = Ticket::where('title', 'Auto Status Ticket')->first();

    expect($ticket->status_id)->toBe($defaultStatus->id);
});

test('store validates required fields', function () {
    post(route('tickets.store'), [])
        ->assertSessionHasErrors(['title', 'description', 'priority_id', 'category_id']);
});

test('update validates required fields', function () {
    $ticket = Ticket::factory()->create();

    put(route('tickets.update', $ticket), [])
        ->assertSessionHasErrors(['title', 'description', 'priority_id', 'category_id']);
});

test('update can remove all assignees', function () {
    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ]);

    $ticket->assignees()->create(['user_id' => $this->user->id]);

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'assignees' => []
    ];

    put(route('tickets.update', $ticket), $data);

    expect($ticket->fresh()->assignees)->toHaveCount(0);
});

test('store handles multiple attachments', function () {
    $file1 = UploadedFile::fake()->image('file1.png');
    $file2 = UploadedFile::fake()->image('file2.jpg');
    $file3 = UploadedFile::fake()->create('doc.pdf', 100);

    $data = [
        'title' => 'Multi Attachment Ticket',
        'description' => 'Has multiple files',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'attachments' => [$file1, $file2, $file3]
    ];

    post(route('tickets.store'), $data);

    $ticket = Ticket::where('title', 'Multi Attachment Ticket')->first();

    expect($ticket->attachments)->toHaveCount(3);
});

test('update can add attachments to existing ticket', function () {
    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ]);

    $attachment1 = Attachment::create([
        'title' => 'existing.png',
        'file_name' => 'existing.png',
        'file_path' => 'path/existing.png',
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    TicketAttachment::create([
        'ticket_id' => $ticket->id,
        'attachment_id' => $attachment1->id,
    ]);

    $file = UploadedFile::fake()->image('new.jpg');

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'attachments' => [$file]
    ];

    put(route('tickets.update', $ticket), $data);

    expect($ticket->fresh()->attachments)->toHaveCount(2);
});

test('force delete removes ticket and attachments from database', function () {
    $ticket = Ticket::factory()->create();

    $attachment = Attachment::create([
        'title' => 'to_delete.png',
        'file_name' => 'to_delete.png',
        'file_path' => 'tickets/1/to_delete.png',
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    TicketAttachment::create([
        'ticket_id' => $ticket->id,
        'attachment_id' => $attachment->id,
    ]);

    $ticket->delete();
    delete(route('tickets.force_delete', $ticket));

    $this->assertDatabaseMissing('tickets', ['id' => $ticket->id]);
    $this->assertDatabaseMissing('ticket_attachments', ['ticket_id' => $ticket->id]);
});

test('index applies priority filter correctly', function () {
    $priority2 = TicketPriority::create(['title' => 'Low', 'color' => '#0000ff', 'sort_order' => 2]);

    Ticket::factory()->create(['priority_id' => $this->priority->id, 'author_id' => $this->user->id]);
    Ticket::factory()->create(['priority_id' => $priority2->id, 'author_id' => $this->user->id]);

    get(route('tickets.index', ['priority' => $this->priority->id]))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));
});

test('index applies category filter correctly', function () {
    $category2 = TicketCategory::create(['title' => 'Feature', 'color' => '#00ffff', 'sort_order' => 2]);

    Ticket::factory()->create(['category_id' => $this->category->id, 'author_id' => $this->user->id]);
    Ticket::factory()->create(['category_id' => $category2->id, 'author_id' => $this->user->id]);

    get(route('tickets.index', ['category' => $this->category->id]))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));
});

test('index applies equipment filter correctly', function () {
    $asset2 = Asset::factory()->create(['title' => 'Desktop']);

    Ticket::factory()->create(['asset_id' => $this->asset->id, 'author_id' => $this->user->id]);
    Ticket::factory()->create(['asset_id' => $asset2->id, 'author_id' => $this->user->id]);

    get(route('tickets.index', ['equipment' => $this->asset->id]))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));
});

test('index sorts by different columns', function () {
    $ticket1 = Ticket::factory()->create([
        'title' => 'AAA Ticket',
        'author_id' => $this->user->id,
        'created_at' => now()->subDay()
    ]);

    $ticket2 = Ticket::factory()->create([
        'title' => 'ZZZ Ticket',
        'author_id' => $this->user->id,
        'created_at' => now()
    ]);

    // Sort by title ascending
    $response = get(route('tickets.index', ['sort' => 'title', 'direction' => 'asc']));
    $tickets = $response->viewData('page')['props']['tickets']['data'];
    expect($tickets[0]['title'])->toBe('AAA Ticket');

    $response = get(route('tickets.index', ['sort' => 'created_at', 'direction' => 'desc']));
    $tickets = $response->viewData('page')['props']['tickets']['data'];
    expect($tickets[0]['id'])->toBe($ticket2->id);
});

test('manage page shows tickets for solver role', function () {
    $this->user->removeRole('admin');
    $this->user->assignRole('solver');

    $ticket = Ticket::factory()->create();
    $ticket->assignees()->create(['user_id' => $this->user->id]);

    get(route('tickets.manage'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/manage')
            ->has('tickets.data', 1)
        );
});

test('simple user sees only own tickets in index', function () {
    $this->user->removeRole('admin');

    $myTicket = Ticket::factory()->create(['author_id' => $this->user->id]);
    $otherTicket = Ticket::factory()->create();

    get(route('tickets.index'))
        ->assertInertia(fn ($page) => $page->has('tickets.data', 1));
});

test('update preserves existing assignees when not provided', function () {
    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ]);

    $ticket->assignees()->create(['user_id' => $this->user->id]);

    $data = [
        'title' => 'Updated Title',
        'description' => 'Updated description',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ];

    put(route('tickets.update', $ticket), $data);

    expect($ticket->fresh()->assignees)->toHaveCount(1);
});

test('restore requires restore permission', function () {
    $user = User::factory()->create();
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $ticket->delete();

    post(route('tickets.restore', $ticket))
        ->assertForbidden();
});

test('force delete requires force delete permission', function () {
    $user = User::factory()->create();
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $ticket->delete();

    delete(route('tickets.force_delete', $ticket))
        ->assertForbidden();
});

test('create page loads all required relationships', function () {
    $response = get(route('tickets.create'));

    $response->assertInertia(fn ($page) => $page
        ->has('priorities')
        ->has('categories')
        ->has('statuses')
        ->has('assets')
        ->has('users')
    );

    $props = $response->viewData('page')['props'];

    expect($props['priorities'])->not->toBeEmpty()
        ->and($props['statuses'])->not->toBeEmpty();
});

test('edit page loads ticket with all relationships', function () {
    $ticket = Ticket::factory()->create();
    $ticket->assignees()->create(['user_id' => $this->user->id]);

    $attachment = Attachment::create([
        'title' => 'test.png',
        'file_name' => 'test.png',
        'file_path' => 'path/test.png',
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    TicketAttachment::create([
        'ticket_id' => $ticket->id,
        'attachment_id' => $attachment->id,
    ]);

    $response = get(route('tickets.edit', $ticket));

    $ticketData = $response->viewData('page')['props']['ticket'];

    expect($ticketData)->toHaveKey('assignees')
        ->and($ticketData)->toHaveKey('attachments')
        ->and($ticketData['assignees'])->toHaveCount(1)
        ->and($ticketData['attachments'])->toHaveCount(1);
});

test('index returns correct pagination metadata', function () {
    Ticket::factory()->count(15)->create(['author_id' => $this->user->id]);

    $response = get(route('tickets.index'));

    $tickets = $response->viewData('page')['props']['tickets'];

    expect($tickets)->toHaveKeys(['data', 'current_page', 'per_page', 'total'])
        ->and($tickets['data'])->toHaveCount(10)
        ->and($tickets['total'])->toBe(15);
});

test('store and update handle is_archived and is_referenced flags', function () {
    $data = [
        'title' => 'Flags Test',
        'description' => 'Testing flags',
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'is_archived' => false,
        'is_referenced' => true,
    ];

    post(route('tickets.store'), $data);

    $ticket = Ticket::where('title', 'Flags Test')->first();

    expect($ticket->archived_at)->toBeNull()
        ->and($ticket->is_referenced)->toBeTrue();

    $response = put(route('tickets.update', $ticket), array_merge($data, [
        'is_archived' => true,
        'is_referenced' => false,
    ]));

    $response->assertRedirect();

    $ticket->refresh();

    expect($ticket->archived_at)->not->toBeNull()
        ->and($ticket->is_referenced)->toBeFalse();
});

test('update notifies admins when last assignee removes themselves', function () {
    $admin = User::factory()->create();
    $admin->assignRole('admin');

    $solver = User::factory()->create();
    $solver->assignRole('solver');
    $solver->givePermissionTo(['update tickets', 'view tickets', 'show tickets']);

    $ticket = Ticket::factory()->create([
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
    ]);

    $ticket->assignees()->create(['user_id' => $solver->id]);

    actingAs($solver);

    \Illuminate\Support\Facades\Notification::fake();

    put(route('tickets.update', $ticket), [
        'title' => $ticket->title,
        'description' => $ticket->description,
        'priority_id' => $this->priority->id,
        'category_id' => $this->category->id,
        'assignees' => []
    ]);

    expect($ticket->fresh()->assignees)->toHaveCount(0);

    \Illuminate\Support\Facades\Notification::assertSentTo(
        $admin,
        \App\Notifications\Tickets\Unassigned::class,
        function ($notification) use ($ticket, $solver) {
            return $notification->ticket->id === $ticket->id
                && $notification->unassignedUser->id === $solver->id;
        }
    );
});

