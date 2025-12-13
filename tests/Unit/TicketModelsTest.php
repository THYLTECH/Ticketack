<?php

namespace Tests\Unit;

use App\Models\Ticket;
use App\Models\TicketAssignee;
use App\Models\TicketAttachment;
use App\Models\TicketCategory;
use App\Models\TicketComment;
use App\Models\TicketEntry;
use App\Models\TicketLog;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(\Tests\TestCase::class);
uses(RefreshDatabase::class);

test('ticket model relations work', function () {
    $ticket = new Ticket();

    expect($ticket->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($ticket->priority())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($ticket->status())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($ticket->category())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($ticket->asset())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);

    expect($ticket->assignees())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($ticket->comments())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($ticket->logs())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($ticket->entries())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class);
    expect($ticket->schedules())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\HasMany::class);
});

test('ticket status accessor calculates progress', function () {
    TicketStatus::query()->delete();

    $s1 = TicketStatus::create(['title' => 'S1', 'color' => '#000', 'sort_order' => 1]);
    $s2 = TicketStatus::create(['title' => 'S2', 'color' => '#000', 'sort_order' => 2]);
    $s3 = TicketStatus::create(['title' => 'S3', 'color' => '#000', 'sort_order' => 3]);

    expect($s1->progress)->toBe(50);
    expect($s3->progress)->toBe(100);
});

test('sub-models relations work', function () {
    // TicketComment
    $comment = new TicketComment();
    expect($comment->ticket())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($comment->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($comment->parent())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);

    // TicketAssignee
    $assignee = new TicketAssignee();
    expect($assignee->ticket())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($assignee->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);

    // TicketLog
    $log = new TicketLog();
    expect($log->ticket())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($log->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);

    // TicketEntry
    $entry = new TicketEntry();
    expect($entry->ticket())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($entry->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);

    // TicketSchedule
    $schedule = new TicketSchedule();
    expect($schedule->ticket())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($schedule->user())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);

    // TicketAttachment
    $attachment = new TicketAttachment();
    expect($attachment->ticket())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
    expect($attachment->attachment())->toBeInstanceOf(\Illuminate\Database\Eloquent\Relations\BelongsTo::class);
});
