<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketEntry;
use App\Models\TicketStatus;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Mockery;
use function Pest\Laravel\{actingAs, delete, get, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    Role::firstOrCreate(['name' => 'solver']);
    $adminRole = Role::firstOrCreate(['name' => 'admin']);

    $this->user = User::factory()->create();
    $this->user->assignRole($adminRole);

    actingAs($this->user);
});

test('entries index loads correctly with data', function () {
    $ticket = Ticket::factory()->create();
    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
        'note' => 'Test entry'
    ]);

    get(route('tickets.entries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('tickets/entries/index')
            ->has('entries.data', 1)
            ->has('stats.total_hours')
            ->has('tickets')
            ->has('statuses')
        );
});

test('user can filter entries by date', function () {
    $ticket = Ticket::factory()->create();

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->subMonth(),
        'end_at' => now()->subMonth()->addHour(),
        'duration_seconds' => 3600,
    ]);

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $params = [
        'start_date' => now()->format('Y-m-d'),
        'end_date' => now()->format('Y-m-d'),
    ];

    get(route('tickets.entries.index', $params))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('entries.data', 1)
        );
});

test('user can filter entries by billable status', function () {
    $ticket = Ticket::factory()->create();

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
        'billable' => true,
    ]);

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
        'billable' => false,
    ]);

    get(route('tickets.entries.index', ['billable' => '1']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('user can filter entries by ticket attributes', function () {
    $status1 = TicketStatus::factory()->create();
    $status2 = TicketStatus::factory()->create();

    $ticket1 = Ticket::factory()->create(['status_id' => $status1->id]);
    $ticket2 = Ticket::factory()->create(['status_id' => $status2->id]);

    TicketEntry::create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    TicketEntry::create([
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    get(route('tickets.entries.index', ['ticket_status' => $status1->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('user can sort entries', function () {
    $ticket = Ticket::factory()->create();

    $entry1 = TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->subDays(2),
        'end_at' => now()->subDays(2)->addHour(),
        'duration_seconds' => 3600,
    ]);

    $entry2 = TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 7200,
    ]);

    get(route('tickets.entries.index', ['sort' => 'duration_seconds', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('entries.data.0.id', $entry2->id)
            ->where('entries.data.1.id', $entry1->id)
        );
});

test('user can store a new time entry', function () {
    $ticket = Ticket::factory()->create();

    $data = [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'hours' => 2,
        'minutes' => 30,
        'description' => 'Worked heavily',
        'billable' => true,
    ];

    post(route('tickets.entries.store'), $data)
        ->assertRedirect();

    $this->assertDatabaseHas('ticket_entries', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'duration_seconds' => 9000,
        'note' => 'Worked heavily',
        'billable' => true,
    ]);
});

test('store validation fails if duration is zero', function () {
    $ticket = Ticket::factory()->create();

    $data = [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'hours' => 0,
        'minutes' => 0,
    ];

    post(route('tickets.entries.store'), $data)
        ->assertSessionHasErrors(['duration']);
});

test('user can delete their own entry', function () {
    $entry = TicketEntry::create([
        'ticket_id' => Ticket::factory()->create()->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    delete(route('tickets.entries.destroy', $entry->id))
        ->assertRedirect();

    $this->assertNull(TicketEntry::find($entry->id));
});

test('user cannot delete entry of another user', function () {
    $otherUser = User::factory()->create();
    $entry = TicketEntry::create([
        'ticket_id' => Ticket::factory()->create()->id,
        'user_id' => $otherUser->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    delete(route('tickets.entries.destroy', $entry->id))
        ->assertForbidden();

    $this->assertDatabaseHas('ticket_entries', ['id' => $entry->id]);
});

test('report can download csv', function () {
    $ticket = Ticket::factory()->create();
    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $response = get(route('tickets.entries.report'));

    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $disposition = $response->headers->get('content-disposition');
    $this->assertStringContainsString('attachment; filename=Time_Report_', $disposition);
});

test('report generates correct filename with date filters', function () {
    $start = now()->subDays(5)->format('Y-m-d');
    $end = now()->format('Y-m-d');

    $response = get(route('tickets.entries.report', [
        'start_date' => $start,
        'end_date' => $end
    ]));

    $response->assertOk();
    $disposition = $response->headers->get('content-disposition');
    $this->assertStringContainsString('from_', $disposition);
});

test('report can download pdf', function () {
    Pdf::shouldReceive('loadView')
        ->once()
        ->andReturnSelf();

    Pdf::shouldReceive('setPaper')
        ->once()
        ->andReturnSelf();

    $mockResponse = response('pdf-content', 200, [
        'Content-Type' => 'application/pdf',
        'Content-Disposition' => 'attachment; filename="report.pdf"'
    ]);

    Pdf::shouldReceive('download')
        ->once()
        ->with(Mockery::pattern('/^Time_Report_.*\.pdf$/'))
        ->andReturn($mockResponse);

    get(route('tickets.entries.report', ['format' => 'pdf']))
        ->assertOk();
});
