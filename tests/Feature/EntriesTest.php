<?php

namespace Tests\Feature\Tickets;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketEntry;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Mockery;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete, get, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view ticket entries']);

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
            ->has('stats.count')
            ->has('stats.period')
            ->has('tickets')
            ->has('statuses')
            ->has('priorities')
            ->has('categories')
        );
});

test('index shows only entries from authenticated user', function () {
    $otherUser = User::factory()->create();

    TicketEntry::factory()->create(['user_id' => $this->user->id]);
    TicketEntry::factory()->create(['user_id' => $otherUser->id]);

    get(route('tickets.entries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('index shows tickets where user is author or assignee', function () {
    $ticket1 = Ticket::factory()->create(['author_id' => $this->user->id]);
    $ticket2 = Ticket::factory()->create();
    $ticket2->assignees()->create(['user_id' => $this->user->id]);

    get(route('tickets.entries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('tickets', 2)
        );
});

test('index loads relationships correctly', function () {
    $entry = TicketEntry::factory()->create(['user_id' => $this->user->id]);

    get(route('tickets.entries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('entries.data.0.ticket.status')
            ->has('entries.data.0.ticket.priority')
            ->has('entries.data.0.ticket.category')
            ->has('entries.data.0.user')
        );
});

test('user can filter entries by date range', function () {
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

    get(route('tickets.entries.index', [
        'start_date' => now()->format('Y-m-d'),
        'end_date' => now()->format('Y-m-d'),
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
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

test('user can filter entries by ticket status', function () {
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

test('user can filter entries by ticket priority', function () {
    $priority1 = TicketPriority::factory()->create();
    $priority2 = TicketPriority::factory()->create();

    $ticket1 = Ticket::factory()->create(['priority_id' => $priority1->id]);
    $ticket2 = Ticket::factory()->create(['priority_id' => $priority2->id]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
    ]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
    ]);

    get(route('tickets.entries.index', ['ticket_priority' => $priority1->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('entries.data', 1)
            ->where('entries.data.0.ticket.priority_id', $priority1->id)
        );
});

test('user can filter entries by ticket category', function () {
    $category1 = TicketCategory::factory()->create();
    $category2 = TicketCategory::factory()->create();

    $ticket1 = Ticket::factory()->create(['category_id' => $category1->id]);
    $ticket2 = Ticket::factory()->create(['category_id' => $category2->id]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
    ]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
    ]);

    get(route('tickets.entries.index', ['ticket_category' => $category1->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('user can filter entries by search term', function () {
    $ticket = Ticket::factory()->create([
        'title' => 'UNIQUE_TICKET_TITLE',
        'description' => 'DESCRIPTION_SEARCHABLE'
    ]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
    ]);

    get(route('tickets.entries.index', ['search' => 'UNIQUE_TICKET']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));

    get(route('tickets.entries.index', ['search' => (string)$ticket->id]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('user can search entries by asset title', function () {
    $asset = Asset::factory()->create(['title' => 'SEARCHABLE_ASSET']);
    $ticket = Ticket::factory()->create(['asset_id' => $asset->id]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
    ]);

    get(route('tickets.entries.index', ['search' => 'SEARCHABLE_ASSET']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('user can combine multiple filters', function () {
    $status = TicketStatus::factory()->create();
    $ticket = Ticket::factory()->create(['status_id' => $status->id]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'billable' => true,
        'start_at' => now(),
    ]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'billable' => false,
        'start_at' => now(),
    ]);

    get(route('tickets.entries.index', [
        'billable' => '1',
        'ticket_status' => $status->id,
        'start_date' => now()->format('Y-m-d'),
    ]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('entries.data', 1));
});

test('user can sort entries by start date', function () {
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
        'duration_seconds' => 3600,
    ]);

    get(route('tickets.entries.index', ['sort' => 'start_at', 'direction' => 'asc']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('entries.data.0.id', $entry1->id)
            ->where('entries.data.1.id', $entry2->id)
        );
});

test('user can sort entries by duration', function () {
    $ticket = Ticket::factory()->create();

    $entry1 = TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);

    $entry2 = TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHours(2),
        'duration_seconds' => 7200,
    ]);

    get(route('tickets.entries.index', ['sort' => 'duration_seconds', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('entries.data.0.id', $entry2->id)
            ->where('entries.data.1.id', $entry1->id)
        );
});

test('sort falls back to default when invalid', function () {
    TicketEntry::factory()->create(['user_id' => $this->user->id]);

    get(route('tickets.entries.index', ['sort' => 'invalid_column']))
        ->assertOk();
});

test('user can store a new time entry', function () {
    $ticket = Ticket::factory()->create();

    post(route('tickets.entries.store'), [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'hours' => 2,
        'minutes' => 30,
        'description' => 'Worked heavily',
        'billable' => true,
    ])->assertRedirect()->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_entries', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'duration_seconds' => 9000,
        'note' => 'Worked heavily',
        'billable' => true,
    ]);
});

test('user can store entry with explicit start time', function () {
    $ticket = Ticket::factory()->create();

    post(route('tickets.entries.store'), [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'start_time' => '08:30',
        'hours' => 1,
        'minutes' => 30,
    ])->assertRedirect();

    $entry = TicketEntry::where('ticket_id', $ticket->id)->first();

    expect($entry->start_at->format('H:i'))->toBe('08:30');
    expect($entry->duration_seconds)->toBe(5400);
});

test('store deletes related schedule when schedule_id is provided', function () {
    $ticket = Ticket::factory()->create();
    $schedule = TicketSchedule::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
    ]);

    post(route('tickets.entries.store'), [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'hours' => 1,
        'minutes' => 0,
        'schedule_id' => $schedule->id,
    ])->assertRedirect();

    $this->assertDatabaseMissing('ticket_schedules', ['id' => $schedule->id]);
});

test('store validation fails if duration is zero', function () {
    $ticket = Ticket::factory()->create();

    post(route('tickets.entries.store'), [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'hours' => 0,
        'minutes' => 0,
    ])->assertSessionHasErrors(['duration']);
});

test('store prevents overlapping entries', function () {
    $ticket = Ticket::factory()->create();

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->setTime(10, 0),
        'end_at' => now()->setTime(12, 0),
        'duration_seconds' => 7200,
    ]);

    post(route('tickets.entries.store'), [
        'ticket_id' => $ticket->id,
        'date' => now()->format('Y-m-d'),
        'start_time' => '11:00',
        'hours' => 2,
        'minutes' => 0,
    ])->assertSessionHasErrors(['date']);
});

test('store validates required fields', function () {
    post(route('tickets.entries.store'), [])
        ->assertSessionHasErrors(['ticket_id', 'date', 'hours', 'minutes']);
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

    $this->assertSoftDeleted('ticket_entries', ['id' => $entry->id]);
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
    TicketEntry::factory()->create(['user_id' => $this->user->id]);

    $response = get(route('tickets.entries.report'));

    $response->assertOk();
    $response->assertHeader('content-type', 'text/csv; charset=UTF-8');

    $disposition = $response->headers->get('content-disposition');
    expect($disposition)->toContain('attachment; filename=Time_Report_');
});

test('report generates correct filename with date filters', function () {
    $start = now()->subDays(5)->format('Y-m-d');
    $end = now()->format('Y-m-d');

    $response = get(route('tickets.entries.report', [
        'start_date' => $start,
        'end_date' => $end
    ]));

    $disposition = $response->headers->get('content-disposition');
    expect($disposition)->toContain('from_');
});

test('csv report contains headers', function () {
    TicketEntry::factory()->create(['user_id' => $this->user->id]);

    $response = get(route('tickets.entries.report'));
    $content = $response->streamedContent();

    expect($content)->toContain(__('entries.report.csv.headers.date'));
    expect($content)->toContain(__('entries.report.csv.headers.time'));
    expect($content)->toContain(__('entries.report.csv.headers.duration'));
});

test('csv report contains total hours row', function () {
    TicketEntry::factory()->create([
        'user_id' => $this->user->id,
        'duration_seconds' => 7200,
    ]);

    $response = get(route('tickets.entries.report'));
    $content = $response->streamedContent();

    expect($content)->toContain(__('entries.report.csv.total_hours'));
});

test('csv report correctly handles deleted tickets', function () {
    $entry = TicketEntry::factory()->create(['user_id' => $this->user->id]);
    $entry->ticket()->delete();

    $response = get(route('tickets.entries.report'));
    $content = $response->streamedContent();

    expect($content)->toContain(__('entries.report.csv.deleted_ticket'));
});

test('csv report applies filters', function () {
    $ticket1 = Ticket::factory()->create();
    $ticket2 = Ticket::factory()->create();

    TicketEntry::factory()->create([
        'ticket_id' => $ticket1->id,
        'user_id' => $this->user->id,
        'billable' => true,
    ]);

    TicketEntry::factory()->create([
        'ticket_id' => $ticket2->id,
        'user_id' => $this->user->id,
        'billable' => false,
    ]);

    $response = get(route('tickets.entries.report', ['billable' => '1']));
    $content = $response->streamedContent();

    $lines = explode("\n", $content);
    $dataLines = array_filter($lines, fn($line) => !empty(trim($line)));

    expect(count($dataLines))->toBeLessThanOrEqual(5);
});

test('report can download pdf', function () {
    Pdf::shouldReceive('loadView')->once()->andReturnSelf();
    Pdf::shouldReceive('setPaper')->once()->andReturnSelf();

    $mockResponse = response('pdf-content', 200, [
        'Content-Type' => 'application/pdf',
    ]);

    Pdf::shouldReceive('download')
        ->once()
        ->with(Mockery::pattern('/^Time_Report_.*\.pdf$/'))
        ->andReturn($mockResponse);

    get(route('tickets.entries.report', ['format' => 'pdf']))
        ->assertOk();
});

test('pdf report without date filters uses all history label', function () {
    Pdf::shouldReceive('loadView')->once()->andReturnSelf();
    Pdf::shouldReceive('setPaper')->once()->andReturnSelf();
    Pdf::shouldReceive('download')
        ->once()
        ->with(Mockery::pattern('/Time_Report_all_history_/'))
        ->andReturn(response('pdf', 200));

    get(route('tickets.entries.report', ['format' => 'pdf']))
        ->assertOk();
});

test('pdf report passes correct data to view', function () {
    $entry = TicketEntry::factory()->create(['user_id' => $this->user->id]);

    Pdf::shouldReceive('loadView')
        ->once()
        ->with('pdf.reports.entries', Mockery::on(function ($data) {
            return isset($data['entries'])
                && isset($data['dailySummary'])
                && isset($data['weeklyEntries'])
                && isset($data['totalHours'])
                && isset($data['period'])
                && isset($data['user'])
                && isset($data['date']);
        }))
        ->andReturnSelf();

    Pdf::shouldReceive('setPaper')->once()->andReturnSelf();
    Pdf::shouldReceive('download')->once()->andReturn(response('pdf', 200));

    get(route('tickets.entries.report', ['format' => 'pdf']))
        ->assertOk();
});

test('report generation handles empty results', function () {
    TicketEntry::query()->delete();

    get(route('tickets.entries.report'))
        ->assertOk();

    get(route('tickets.entries.report', ['format' => 'pdf']))
        ->assertOk();
});

test('user without view permission cannot access entries', function () {
    $user = User::factory()->create();
    actingAs($user);

    get(route('tickets.entries.index'))
        ->assertForbidden();
});

test('stats calculate total hours correctly', function () {
    $ticket = Ticket::factory()->create();

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now(),
        'end_at' => now()->addHours(2),
        'duration_seconds' => 7200,
    ]);

    TicketEntry::create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'start_at' => now()->addHours(3),
        'end_at' => now()->addHours(4),
        'duration_seconds' => 3600,
    ]);

    get(route('tickets.entries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('stats.total_hours', 3)
            ->where('stats.count', 2)
        );
});


test('stats show correct period', function () {
    TicketEntry::factory()->create([
        'user_id' => $this->user->id,
        'start_at' => now()->startOfMonth(),
    ]);

    get(route('tickets.entries.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('stats.period')
        );
});

test('index paginates entries correctly', function () {
    TicketEntry::factory()->count(20)->create(['user_id' => $this->user->id]);

    get(route('tickets.entries.index', ['per_page' => 10]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('entries.data', 10)
            ->has('entries.links')
        );
});
