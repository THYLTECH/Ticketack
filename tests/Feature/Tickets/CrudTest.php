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
use function Pest\Laravel\{actingAs, get, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'view tickets']);
    Permission::create(['name' => 'show tickets']);
    Permission::create(['name' => 'create tickets']);
    Permission::create(['name' => 'update tickets']);
    Permission::create(['name' => 'delete tickets']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
    Storage::fake('public');
});

test('tickets index page loads and shows assigned tickets', function () {
    $tickets = Ticket::factory()->count(3)->create();

    foreach ($tickets as $ticket) {
        $ticket->assignees()->create([
            'user_id' => $this->user->id
        ]);
    }

    get(route('tickets.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/index')
            ->has('tickets', 3)
        );
});

test('tickets create page loads', function () {
    get(route('tickets.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/create')
        );
});

test(/**
 * @throws \JsonException
 */ /**
 * @throws \JsonException
 */ 'user can store a new ticket with attachments', function () {
    $priority = TicketPriority::create(['title' => 'High', 'color' => '#ff0000', 'sort_order' => 1]);
    $status = TicketStatus::create(['title' => 'New', 'color' => '#00ff00', 'sort_order' => 1, 'is_default' => true]);
    $category = TicketCategory::create(['title' => 'Bug', 'color' => '#0000ff', 'sort_order' => 1]);
    $asset = Asset::factory()->create();

    $file = UploadedFile::fake()->image('error.jpg');

    $data = [
        'title' => 'Critical Bug',
        'description' => 'System crash on load',
        'priority_id' => $priority->id,
        'status_id' => $status->id,
        'category_id' => $category->id,
        'asset_id' => $asset->id,
        'attachments' => [[
            'title' => 'Screenshot',
            'file' => $file
        ]]
    ];

    post(route('tickets.store'), $data)
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('tickets.manage'));

    $this->assertDatabaseHas('tickets', ['title' => 'Critical Bug']);

    $ticket = Ticket::where('title', 'Critical Bug')->first();
    $this->assertDatabaseHas('ticket_attachments', ['ticket_id' => $ticket->id]);
});

test('ticket validation fails for missing required fields', function () {
    post(route('tickets.store'), [])
        ->assertSessionHasErrors(['title', 'priority_id', 'category_id', 'status_id', 'asset_id']);
});
