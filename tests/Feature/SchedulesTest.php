<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketSchedule;
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
