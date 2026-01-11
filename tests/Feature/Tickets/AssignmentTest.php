<?php

namespace Tests\Feature\Tickets;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketAssignee;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, get, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    $permissions = [
        'view tickets',
        'show tickets',
        'create tickets',
        'update tickets',
        'delete tickets',
        'assign tickets',
        'be assigned tickets'
    ];

    foreach ($permissions as $perm) {
        Permission::firstOrCreate(['name' => $perm]);
    }

    $adminRole = Role::firstOrCreate(['name' => 'admin']);
    $agentRole = Role::firstOrCreate(['name' => 'agent']);
    $userRole = Role::firstOrCreate(['name' => 'user']);

    $this->asset = Asset::factory()->create(['title' => 'Laptop']);

    $this->priority = TicketPriority::create(['title' => 'High', 'color' => '#ff0000', 'sort_order' => 3]);
    $this->mediumPriority = TicketPriority::create(['title' => 'Medium', 'color' => '#ffaa00', 'sort_order' => 2]);
    $this->lowPriority = TicketPriority::create(['title' => 'Low', 'color' => '#00ff00', 'sort_order' => 1]);

    $this->status = TicketStatus::create([
        'title' => 'New',
        'color' => '#00ff00',
        'sort_order' => 1,
        'is_default' => true
    ]);
    $this->openStatus = TicketStatus::create([
        'title' => 'Open',
        'color' => '#0000ff',
        'sort_order' => 2
    ]);

    $this->category = TicketCategory::create(['title' => 'Bug', 'color' => '#0000ff', 'sort_order' => 1]);
    $this->featureCategory = TicketCategory::create(['title' => 'Feature', 'color' => '#00ff00', 'sort_order' => 2]);

    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    $this->admin->givePermissionTo(['assign tickets', 'be assigned tickets', 'view tickets', 'show tickets']);

    $this->agent = User::factory()->create();
    $this->agent->assignRole($agentRole);
    $this->agent->givePermissionTo(['be assigned tickets', 'view tickets', 'show tickets']);

    $this->regularUser = User::factory()->create();
    $this->regularUser->assignRole($userRole);
    $this->regularUser->givePermissionTo(['view tickets', 'show tickets', 'create tickets']);

    $this->createTicket = function (array $attributes = []) {
        $defaults = [
            'author_id' => $this->regularUser->id,
            'asset_id' => $this->asset->id,
            'priority_id' => $this->priority->id,
            'status_id' => $this->status->id,
            'category_id' => $this->category->id,
        ];

        return Ticket::factory()->create(array_merge($defaults, $attributes));
    };
});

// ========== INDEX TESTS ==========

test('assignment index page loads successfully for users with permission', function () {
    actingAs($this->admin);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->component('tickets/assignment')
        ->has('tickets')
        ->has('stats')
        ->has('assignableUsers')
        ->has('canAssign')
        ->has('canBeAssigned')
        ->has('filters')
        ->has('priorities')
        ->has('statuses')
        ->has('categories')
    );
});

test('assignment index redirects users without permission', function () {
    actingAs($this->regularUser);

    $response = get(route('tickets.assignment.index'));

    $response->assertRedirect(route('dashboard'));
    $response->assertSessionHas('error');
});

test('assignment index shows only unassigned tickets', function () {
    actingAs($this->admin);

    $unassignedTicket = ($this->createTicket)();

    $assignedTicket = ($this->createTicket)();

    TicketAssignee::create([
        'ticket_id' => $assignedTicket->id,
        'user_id' => $this->agent->id,
    ]);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $unassignedTicket->id)
    );
});

test('assignment index sorts tickets by priority then by date', function () {
    actingAs($this->admin);

    $lowOld = Ticket::factory()->create([
        'author_id' => $this->regularUser->id,
        'priority_id' => $this->lowPriority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'created_at' => now()->subDays(5),
    ]);

    $highNew = Ticket::factory()->create([
        'author_id' => $this->regularUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'created_at' => now()->subDays(),
    ]);

    $highOld = Ticket::factory()->create([
        'author_id' => $this->regularUser->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'created_at' => now()->subDays(3),
    ]);

    $mediumNew = Ticket::factory()->create([
        'author_id' => $this->regularUser->id,
        'priority_id' => $this->mediumPriority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
        'created_at' => now()->subHours(12),
    ]);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.data.0.id', $highOld->id)
        ->where('tickets.data.1.id', $highNew->id)
        ->where('tickets.data.2.id', $mediumNew->id)
        ->where('tickets.data.3.id', $lowOld->id)
    );
});

test('assignment index filters by search query', function () {
    actingAs($this->admin);

    $matchingTicket = Ticket::factory()->create([
        'author_id' => $this->regularUser->id,
        'title' => 'Bug in login system',
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    Ticket::factory()->create([
        'author_id' => $this->regularUser->id,
        'title' => 'Feature request',
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $response = get(route('tickets.assignment.index', ['search' => 'login']));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $matchingTicket->id)
    );
});

test('assignment index filters by priority', function () {
    actingAs($this->admin);

    $highPriorityTicket = ($this->createTicket)([
        'priority_id' => $this->priority->id,
    ]);

    ($this->createTicket)([
        'priority_id' => $this->lowPriority->id,
    ]);

    $response = get(route('tickets.assignment.index', ['priority' => $this->priority->id]));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $highPriorityTicket->id)
    );
});

test('assignment index filters by status', function () {
    actingAs($this->admin);

    $newTicket = ($this->createTicket)([
        'status_id' => $this->status->id,
    ]);

    ($this->createTicket)([
        'status_id' => $this->openStatus->id,
    ]);

    $response = get(route('tickets.assignment.index', ['status' => $this->status->id]));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $newTicket->id)
    );
});

test('assignment index filters by category', function () {
    actingAs($this->admin);

    $bugTicket = ($this->createTicket)([
        'category_id' => $this->category->id,
    ]);

    ($this->createTicket)([
        'category_id' => $this->featureCategory->id,
    ]);

    $response = get(route('tickets.assignment.index', ['category' => $this->category->id]));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $bugTicket->id)
    );
});

test('assignment index filters by date range', function () {
    actingAs($this->admin);

    ($this->createTicket)([
        'created_at' => now()->subDays(10),
    ]);

    $recentTicket = ($this->createTicket)([
        'created_at' => now()->subDays(2),
    ]);

    $response = get(route('tickets.assignment.index', [
        'date_from' => now()->subDays(3)->format('Y-m-d'),
        'date_to' => now()->format('Y-m-d'),
    ]));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $recentTicket->id)
    );
});

test('assignment index shows correct statistics', function () {
    actingAs($this->admin);

    Ticket::factory()->count(3)->create([
        'author_id' => $this->regularUser->id,
        'asset_id' => $this->asset->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    Ticket::factory()->count(2)->create([
        'author_id' => $this->regularUser->id,
        'asset_id' => $this->asset->id,
        'priority_id' => $this->lowPriority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('stats.total_unassigned', 5)
        ->has('stats.priority_stats')
        ->has('stats.oldest_unassigned_days')
    );
});

test('assignment index excludes soft deleted tickets', function () {
    actingAs($this->admin);

    $activeTicket = ($this->createTicket)();

    ($this->createTicket)([
        'deleted_at' => now(),
    ]);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 1)
        ->where('tickets.data.0.id', $activeTicket->id)
    );
});

test('assignment index paginates results', function () {
    actingAs($this->admin);

    Ticket::factory()->count(20)->create([
        'author_id' => $this->regularUser->id,
        'asset_id' => $this->asset->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 20)
        ->where('tickets.per_page', 15)
        ->where('tickets.current_page', 1)
    );
});

test('assignment index shows assignable users list', function () {
    actingAs($this->admin);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->has('assignableUsers', 2)
    );
});

test('assignment index sets correct permissions flags', function () {
    actingAs($this->admin);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('canAssign', true)
        ->where('canBeAssigned', true)
    );
});

// ========== ASSIGN TESTS ==========

test('admin can assign ticket to single user', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_id' => $this->agent->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);
});

test('admin can assign ticket to multiple users', function () {
    actingAs($this->admin);

    $agent2 = User::factory()->create();
    $agent2->givePermissionTo('be assigned tickets');

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_ids' => [$this->agent->id, $agent2->id],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $agent2->id,
    ]);
});

test('cannot assign ticket to non-existent user', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_id' => 99999,
    ]);

    $response->assertSessionHasErrors('user_id');
});

test('cannot assign ticket to user without be assigned tickets permission', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_id' => $this->regularUser->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');

    $this->assertDatabaseMissing('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->regularUser->id,
    ]);
});

test('cannot assign ticket without user_id or user_ids', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), []);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('cannot assign ticket to already assigned user', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    TicketAssignee::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_id' => $this->agent->id,
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('user without assign tickets permission cannot assign', function () {
    actingAs($this->agent);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_id' => $this->agent->id,
    ]);

    $response->assertStatus(403);
});

test('assign handles partial success with mixed users', function () {
    actingAs($this->admin);

    $agent2 = User::factory()->create();
    $agent2->givePermissionTo('be assigned tickets');

    $ticket = ($this->createTicket)();

    TicketAssignee::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_ids' => [
            $this->agent->id,
            $agent2->id,
            $this->regularUser->id,
        ],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $agent2->id,
    ]);

    $this->assertDatabaseMissing('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->regularUser->id,
    ]);
});

test('assign with user_ids array validates each user id', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_ids' => [99999],
    ]);

    $response->assertSessionHasErrors('user_ids.0');
});

// ========== SELF-ASSIGN TESTS ==========

test('user with permission can self-assign ticket', function () {
    actingAs($this->agent);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.self-assign', $ticket));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);
});

test('user without be assigned tickets permission cannot self-assign', function () {
    actingAs($this->regularUser);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.self-assign', $ticket));

    $response->assertStatus(403);
});

test('user cannot self-assign if already assigned', function () {
    actingAs($this->agent);

    $ticket = ($this->createTicket)();

    TicketAssignee::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);

    $response = post(route('tickets.assignment.self-assign', $ticket));

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('admin can self-assign ticket', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.self-assign', $ticket));

    $response->assertRedirect();
    $response->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_assignees', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->admin->id,
    ]);
});

// ========== EDGE CASES ==========

test('assignment index handles empty ticket list', function () {
    actingAs($this->admin);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 0)
        ->where('stats.total_unassigned', 0)
        ->where('stats.oldest_unassigned_days', 0)
    );
});

test('assignment index handles mixed priority tickets correctly', function () {
    actingAs($this->admin);

    $highTicket = ($this->createTicket)([
        'priority_id' => $this->priority->id,
    ]);

    $lowTicket = ($this->createTicket)([
        'priority_id' => $this->lowPriority->id,
    ]);

    $response = get(route('tickets.assignment.index'));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 2)
        ->where('tickets.data.0.id', $highTicket->id)
        ->where('tickets.data.1.id', $lowTicket->id)
    );
});

test('assign returns error when all users are already assigned', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    TicketAssignee::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->agent->id,
    ]);

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_ids' => [$this->agent->id],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('assign returns error when all users cannot be assigned', function () {
    actingAs($this->admin);

    $ticket = ($this->createTicket)();

    $response = post(route('tickets.assignment.assign', $ticket), [
        'user_ids' => [$this->regularUser->id],
    ]);

    $response->assertRedirect();
    $response->assertSessionHas('error');
});

test('assignment index filter with all value shows all tickets', function () {
    actingAs($this->admin);

    Ticket::factory()->count(3)->create([
        'author_id' => $this->regularUser->id,
        'asset_id' => $this->asset->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    Ticket::factory()->count(2)->create([
        'author_id' => $this->regularUser->id,
        'asset_id' => $this->asset->id,
        'priority_id' => $this->lowPriority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);

    $response = get(route('tickets.assignment.index', ['priority' => 'all']));

    $response->assertStatus(200);
    $response->assertInertia(fn($page) => $page
        ->where('tickets.total', 5)
    );
});

