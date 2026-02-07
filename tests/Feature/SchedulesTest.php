<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;

use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete, get, put, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    $permissions = [
        'view tickets',
        'view planning',
        'manage planning'
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
});

test('planning index page loads with correct props', function () {
    $solver = User::factory()->create();
    $solver->assignRole('solver');

    $ticket = Ticket::factory()->create();
    $ticket->assignees()->create(['user_id' => $this->user->id]);

    TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $solver->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60
    ]);

    get(route('tickets.planning.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/planning/index')
            ->has('events')
            ->has('solvers')
            ->has('myTickets')
        );
});

test('user can schedule a ticket', function () {
    $ticket = Ticket::factory()->create();

    $startDate = Carbon::now()->addDay()->setHour(10)->setMinute(0)->setSecond(0);

    $data = [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => $startDate->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertRedirect();

    $this->assertDatabaseHas('ticket_schedules', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'duration_minutes' => 60,
    ]);
});

test('user cannot schedule overlapping events for same solver', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    $baseDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate,
        'end_date' => $baseDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    $data = [
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate->copy()->addMinutes(30)->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['overlap']);
});

test('user can update a schedule', function () {
    $ticket = Ticket::factory()->create();

    $schedule = TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDay()->addHour(),
        'duration_minutes' => 60,
    ]);

    $data = [
        'start_date' => now()->addDay()->addHours(2)->toDateTimeString(),
        'duration_minutes' => 90,
    ];

    put(route('tickets.planning.update', $schedule->id), $data)
        ->assertRedirect();

    $this->assertDatabaseHas('ticket_schedules', [
        'id' => $schedule->id,
        'duration_minutes' => 90,
    ]);
});

test('update validation prevents overlapping', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    $baseDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate,
        'end_date' => $baseDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    $scheduleToMove = TicketSchedule::create([
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate->copy()->addHours(5),
        'end_date' => $baseDate->copy()->addHours(6),
        'duration_minutes' => 60,
    ]);

    $data = [
        'start_date' => $baseDate->copy()->addMinutes(30)->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    put(route('tickets.planning.update', $scheduleToMove->id), $data)
        ->assertSessionHasErrors(['overlap']);
});

test('user can delete a schedule', function () {
    $ticket = Ticket::factory()->create();

    $schedule = TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60,
    ]);

    delete(route('tickets.planning.destroy', $schedule->id))
        ->assertRedirect();

    $this->assertDatabaseMissing('ticket_schedules', ['id' => $schedule->id]);
});

test('user without permissions cannot manage schedules', function () {
    $user = User::factory()->create();
    actingAs($user);

    $ticket = Ticket::factory()->create();
    $schedule = TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $user->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60
    ]);

    get(route('tickets.planning.index'))->assertForbidden();

    $data = [
        'ticket_id' => $ticket->id,
        'user_id' => $user->id,
        'start_date' => now()->addDay(),
        'duration_minutes' => 60,
    ];
    post(route('tickets.planning.store'), $data)->assertForbidden();

    put(route('tickets.planning.update', $schedule->id), [
        'start_date' => now()->addDay(),
        'duration_minutes' => 60,
    ])->assertForbidden();

    delete(route('tickets.planning.destroy', $schedule->id))->assertForbidden();
});

test('store validation requires minimum 15 minutes duration', function () {
    $ticket = Ticket::factory()->create();

    $data = [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now()->addDay()->toDateTimeString(),
        'duration_minutes' => 10, // Less than minimum
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['duration_minutes']);
});

test('store validation requires valid ticket_id', function () {
    $data = [
        'ticket_id' => 99999,
        'user_id' => $this->user->id,
        'start_date' => now()->addDay()->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['ticket_id']);
});

test('store validation requires valid user_id', function () {
    $ticket = Ticket::factory()->create();

    $data = [
        'ticket_id' => $ticket->id,
        'user_id' => 99999,
        'start_date' => now()->addDay()->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['user_id']);
});

test('store validation requires all fields', function () {
    post(route('tickets.planning.store'), [])
        ->assertSessionHasErrors(['ticket_id', 'user_id', 'start_date', 'duration_minutes']);
});

test('update validation requires minimum 15 minutes duration', function () {
    $ticket = Ticket::factory()->create();
    $schedule = TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDay()->addHour(),
        'duration_minutes' => 60,
    ]);

    $data = [
        'start_date' => now()->addDay()->toDateTimeString(),
        'duration_minutes' => 10,
    ];

    put(route('tickets.planning.update', $schedule->id), $data)
        ->assertSessionHasErrors(['duration_minutes']);
});

test('update validation requires all fields', function () {
    $ticket = Ticket::factory()->create();
    $schedule = TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDay()->addHour(),
        'duration_minutes' => 60,
    ]);

    put(route('tickets.planning.update', $schedule->id), [])
        ->assertSessionHasErrors(['start_date', 'duration_minutes']);
});

test('index displays only current user entries', function () {
    $otherUser = User::factory()->create();
    $otherUser->assignRole('solver');

    $ticket = Ticket::factory()->create();

    // Create entry for another user
    $entry = \App\Models\TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $otherUser->id,
        'start_at' => now()->subDay()->setHour(9),
        'end_at' => now()->subDay()->setHour(10),
        'duration_seconds' => 3600,
    ]);

    // Create entry for current user
    $myEntry = \App\Models\TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->subDay()->setHour(11),
        'end_at' => now()->subDay()->setHour(12),
        'duration_seconds' => 3600,
    ]);

    $response = get(route('tickets.planning.index'));

    $events = $response->viewData('page')['props']['events'];

    // Should contain only current user's entry
    $entryIds = collect($events)->pluck('id')->filter(fn($id) => str_starts_with((string)$id, 'entry-'));

    expect($entryIds)->toContain('entry-' . $myEntry->id)
        ->and($entryIds)->not->toContain('entry-' . $entry->id);
});

test('index displays all schedules regardless of user', function () {
    $otherUser = User::factory()->create();
    $otherUser->assignRole('solver');

    $ticket = Ticket::factory()->create();

    TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $otherUser->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDay()->addHour(),
        'duration_minutes' => 60,
    ]);

    $response = get(route('tickets.planning.index'));

    $events = $response->viewData('page')['props']['events'];

    expect($events)->toHaveCount(1);
});

test('store calculates end_date correctly', function () {
    $ticket = Ticket::factory()->create();
    $startDate = Carbon::now()->addDay()->setHour(10)->setMinute(0)->setSecond(0);

    $data = [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => $startDate->toDateTimeString(),
        'duration_minutes' => 90,
    ];

    post(route('tickets.planning.store'), $data);

    $schedule = TicketSchedule::first();

    expect(Carbon::parse($schedule->start_date)->diffInMinutes(Carbon::parse($schedule->end_date)))->toEqual(90);
});

test('update calculates end_date correctly', function () {
    $ticket = Ticket::factory()->create();
    $schedule = TicketSchedule::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_date' => now()->addDay(),
        'end_date' => now()->addDay()->addHour(),
        'duration_minutes' => 60,
    ]);

    $newStart = now()->addDay()->addHours(2);

    put(route('tickets.planning.update', $schedule->id), [
        'start_date' => $newStart->toDateTimeString(),
        'duration_minutes' => 120,
    ]);

    $schedule->refresh();

    expect(Carbon::parse($schedule->start_date)->diffInMinutes(Carbon::parse($schedule->end_date)))->toEqual(120);
});

test('can schedule at exact same time for different users', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();
    $otherUser = User::factory()->create();
    $otherUser->assignRole('solver');

    $startDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $startDate,
        'end_date' => $startDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    // Same time but different user should work
    $data = [
        'ticket_id' => $ticket2->id,
        'user_id' => $otherUser->id,
        'start_date' => $startDate->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect(TicketSchedule::count())->toBe(2);
});

test('overlap detection works for partial overlaps at start', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    $baseDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    // Existing: 10:00 - 11:00
    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate,
        'end_date' => $baseDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    // Try to create: 09:30 - 10:30 (overlaps at 10:00-10:30)
    $data = [
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate->copy()->subMinutes(30)->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['overlap']);
});

test('overlap detection works for partial overlaps at end', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    $baseDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    // Existing: 10:00 - 11:00
    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate,
        'end_date' => $baseDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    // Try to create: 10:30 - 11:30 (overlaps at 10:30-11:00)
    $data = [
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate->copy()->addMinutes(30)->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['overlap']);
});

test('overlap detection works for complete overlap', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    $baseDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    // Existing: 10:00 - 11:00
    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate,
        'end_date' => $baseDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    // Try to create: 09:00 - 12:00 (completely overlaps existing)
    $data = [
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate->copy()->subHour()->toDateTimeString(),
        'duration_minutes' => 180,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertSessionHasErrors(['overlap']);
});

test('no overlap when schedules are back to back', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    $baseDate = Carbon::now()->addDay()->setHour(10)->setMinute(0);

    // First: 10:00 - 11:00
    TicketSchedule::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate,
        'end_date' => $baseDate->copy()->addMinutes(60),
        'duration_minutes' => 60,
    ]);

    // Second: 11:00 - 12:00 (starts exactly when first ends)
    $data = [
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_date' => $baseDate->copy()->addMinutes(60)->toDateTimeString(),
        'duration_minutes' => 60,
    ];

    post(route('tickets.planning.store'), $data)
        ->assertRedirect()
        ->assertSessionHasNoErrors();

    expect(TicketSchedule::count())->toBe(2);
});

test('index loads myTickets only for open statuses', function () {
    $openStatus = TicketStatus::create([
        'title' => 'Open',
        'color' => '#00ff00',
        'sort_order' => 1,
        'is_closed' => false
    ]);

    $closedStatus = TicketStatus::create([
        'title' => 'Closed',
        'color' => '#ff0000',
        'sort_order' => 2,
        'is_closed' => true
    ]);

    $openTicket = Ticket::factory()->create(['status_id' => $openStatus->id]);
    $openTicket->assignees()->create(['user_id' => $this->user->id]);

    $closedTicket = Ticket::factory()->create(['status_id' => $closedStatus->id]);
    $closedTicket->assignees()->create(['user_id' => $this->user->id]);

    $response = get(route('tickets.planning.index'));

    $myTickets = $response->viewData('page')['props']['myTickets'];

    expect($myTickets)->toHaveCount(1)
        ->and($myTickets[0]['id'])->toBe($openTicket->id);
});

test('index loads solvers with avatars', function () {
    $solver = User::factory()->create();
    $solver->assignRole('solver');

    $response = get(route('tickets.planning.index'));

    $solvers = $response->viewData('page')['props']['solvers'];

    $solverData = collect($solvers)->firstWhere('id', $solver->id);

    expect($solverData)->toHaveKeys(['id', 'name', 'email', 'avatar']);
});


