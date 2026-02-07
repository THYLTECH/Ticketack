<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketComment;
use App\Models\TicketEntry;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
use App\Notifications\Tickets\Assigned;
use App\Notifications\Tickets\CommentCreated;
use App\Notifications\Tickets\Created;
use App\Notifications\Tickets\EntryCreated;
use App\Notifications\Tickets\EntryDeleted;
use App\Notifications\Tickets\PriorityChanged;
use App\Notifications\Tickets\ScheduleCreated;
use App\Notifications\Tickets\ScheduleDeleted;
use App\Notifications\Tickets\ScheduleUpdated;
use App\Notifications\Tickets\StatusChanged;
use App\Notifications\Tickets\Unassigned;
use App\Notifications\Tickets\Updated;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\actingAs;

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

    $this->admin = User::factory()->create();
    $this->admin->assignRole($adminRole);
    $this->admin->givePermissionTo(Permission::all());

    $this->solver = User::factory()->create();
    $this->solver->assignRole('solver');
    $this->solver->givePermissionTo(['view tickets', 'show tickets', 'update tickets']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(['view tickets', 'show tickets', 'create tickets']);

    // Acting as admin by default for observer compatibility
    actingAs($this->admin);

    $this->priority = TicketPriority::create(['title' => 'High', 'color' => '#ff0000', 'sort_order' => 1]);
    $this->status = TicketStatus::create(['title' => 'New', 'color' => '#00ff00', 'sort_order' => 1, 'is_default' => true]);
    $this->category = TicketCategory::create(['title' => 'Bug', 'color' => '#0000ff', 'sort_order' => 1]);

    $this->ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'priority_id' => $this->priority->id,
        'status_id' => $this->status->id,
        'category_id' => $this->category->id,
    ]);
});

test('Assigned notification has correct structure', function () {
    $notification = new Assigned($this->ticket);

    expect($notification->databaseType($this->solver))->toBe('ticket_assigned');

    $channels = $notification->via($this->solver);
    expect($channels)->toBeArray();

    $databaseData = $notification->toDatabase($this->solver);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('category')
        ->toHaveKey('title')
        ->toHaveKey('message')
        ->toHaveKey('action')
        ->toHaveKey('action_url')
        ->and($databaseData['type'])->toBe('ticket_assigned');
});

test('Created notification has correct structure', function () {
    $notification = new Created($this->ticket);

    expect($notification->databaseType($this->admin))->toBe('ticket_created');

    $databaseData = $notification->toDatabase($this->admin);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('category')
        ->toHaveKey('title')
        ->toHaveKey('message')
        ->toHaveKey('action_url')
        ->and($databaseData['type'])->toBe('ticket_created');
});

test('Updated notification has correct structure', function () {
    $notification = new Updated($this->ticket);

    expect($notification->databaseType($this->user))->toBe('ticket_updated');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_updated');
});

test('StatusChanged notification has correct structure', function () {
    $oldStatus = TicketStatus::create(['title' => 'Old', 'color' => '#aaaaaa', 'sort_order' => 2]);
    $newStatus = TicketStatus::create(['title' => 'New Status', 'color' => '#bbbbbb', 'sort_order' => 3]);

    $notification = new StatusChanged($this->ticket, $oldStatus, $newStatus);

    expect($notification->databaseType($this->user))->toBe('ticket_status_changed');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_status_changed');
});

test('PriorityChanged notification has correct structure', function () {
    $oldPriority = TicketPriority::create(['title' => 'Low', 'color' => '#00ff00', 'sort_order' => 2]);
    $newPriority = TicketPriority::create(['title' => 'Critical', 'color' => '#ff0000', 'sort_order' => 3]);

    $notification = new PriorityChanged($this->ticket, $oldPriority, $newPriority);

    expect($notification->databaseType($this->user))->toBe('ticket_priority_changed');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_priority_changed');
});

test('Unassigned notification has correct structure', function () {
    $notification = new Unassigned($this->ticket, $this->solver);

    expect($notification->databaseType($this->admin))->toBe('ticket_unassigned');

    $databaseData = $notification->toDatabase($this->admin);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('category')
        ->toHaveKey('title')
        ->toHaveKey('message')
        ->toHaveKey('action')
        ->toHaveKey('action_url')
        ->and($databaseData['type'])->toBe('ticket_unassigned');
});

test('CommentCreated notification has correct structure', function () {
    $comment = new TicketComment([
        'ticket_id' => $this->ticket->id,
        'user_id' => $this->user->id,
        'content' => 'Test comment',
    ]);
    $comment->id = 1;

    $notification = new CommentCreated($this->ticket, $comment);

    expect($notification->databaseType($this->solver))->toBe('ticket_comment_created');

    $databaseData = $notification->toDatabase($this->solver);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_comment_created');
});

test('EntryCreated notification has correct structure', function () {
    $entry = new TicketEntry([
        'ticket_id' => $this->ticket->id,
        'user_id' => $this->solver->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);
    $entry->id = 1;
    $entry->setRelation('ticket', $this->ticket);
    $entry->setRelation('user', $this->solver);

    $notification = new EntryCreated($this->ticket, $entry);

    expect($notification->databaseType($this->user))->toBe('ticket_entry_created');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_entry_created');
});

test('EntryDeleted notification has correct structure', function () {
    $entry = new TicketEntry([
        'ticket_id' => $this->ticket->id,
        'user_id' => $this->solver->id,
        'start_at' => now(),
        'end_at' => now()->addHour(),
        'duration_seconds' => 3600,
    ]);
    $entry->id = 1;
    $entry->setRelation('ticket', $this->ticket);
    $entry->setRelation('user', $this->solver);

    $notification = new EntryDeleted($this->ticket, $entry);

    expect($notification->databaseType($this->user))->toBe('ticket_entry_deleted');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_entry_deleted');
});

test('ScheduleCreated notification has correct structure', function () {
    $schedule = new TicketSchedule([
        'ticket_id' => $this->ticket->id,
        'user_id' => $this->solver->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60,
    ]);
    $schedule->id = 1;
    $schedule->setRelation('ticket', $this->ticket);
    $schedule->setRelation('user', $this->solver);

    $notification = new ScheduleCreated($this->ticket, $schedule);

    expect($notification->databaseType($this->user))->toBe('ticket_schedule_created');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_schedule_created');
});

test('ScheduleUpdated notification has correct structure', function () {
    $schedule = new TicketSchedule([
        'ticket_id' => $this->ticket->id,
        'user_id' => $this->solver->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60,
    ]);
    $schedule->id = 1;
    $schedule->setRelation('ticket', $this->ticket);
    $schedule->setRelation('user', $this->solver);

    $notification = new ScheduleUpdated($this->ticket, $schedule);

    expect($notification->databaseType($this->user))->toBe('ticket_schedule_updated');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_schedule_updated');
});

test('ScheduleDeleted notification has correct structure', function () {
    $schedule = new TicketSchedule([
        'ticket_id' => $this->ticket->id,
        'user_id' => $this->solver->id,
        'start_date' => now(),
        'end_date' => now()->addHour(),
        'duration_minutes' => 60,
    ]);
    $schedule->id = 1;
    $schedule->setRelation('ticket', $this->ticket);
    $schedule->setRelation('user', $this->solver);

    $notification = new ScheduleDeleted($this->ticket, $schedule);

    expect($notification->databaseType($this->user))->toBe('ticket_schedule_deleted');

    $databaseData = $notification->toDatabase($this->user);
    expect($databaseData)
        ->toHaveKey('type')
        ->toHaveKey('message')
        ->and($databaseData['type'])->toBe('ticket_schedule_deleted');
});

test('notifications respect user preferences', function () {
    // Create a preference for the user
    $this->solver->notificationPreferences()->create([
        'type' => 'ticket_assigned',
        'channel' => 'database',
        'category' => 'tickets',
        'enabled' => true,
    ]);

    $notification = new Assigned($this->ticket);
    $channels = $notification->via($this->solver);

    expect($channels)->toContain('database');
});

test('notifications fallback to default channels when no preferences', function () {
    $notification = new Assigned($this->ticket);
    $channels = $notification->via($this->solver);

    // Default fallback is 'mail'
    expect($channels)->toContain('mail');
});

