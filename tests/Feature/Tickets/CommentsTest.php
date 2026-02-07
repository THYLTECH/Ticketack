<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use App\Models\TicketLog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs, delete, post, put};

uses(RefreshDatabase::class);

/**
 * Test suite for Ticket Comments features including
 * attachments management and activity logging.
 */

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view tickets']);
    Permission::firstOrCreate(['name' => 'show tickets']);

    $this->user = User::factory()->create(['email_verified_at' => now()]);
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
    Storage::fake('public');
});

test('user can add a comment with attachments and it creates a log', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $file = UploadedFile::fake()->image('document.jpg');

    post(route('tickets.comments.store', $ticket), [
        'content' => 'Hello with file',
        'attachments' => [$file]
    ])->assertRedirect();

    $comment = TicketComment::latest('id')->first();

    expect($comment->content)->toBe('Hello with file')
        ->and($comment->attachments)->toHaveCount(1);

    $this->assertDatabaseHas('ticket_logs', [
        'ticket_id' => $ticket->id,
        'action' => 'commented',
    ]);
});

test('user can update their own comment and it updates the log', function () {
    $ticket = Ticket::factory()->create();
    $comment = TicketComment::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'content' => 'Old Content'
    ]);

    put(route('tickets.comments.update', [$ticket, $comment]), ['content' => 'New Content'])
        ->assertRedirect();

    $this->assertDatabaseHas('ticket_logs', [
        'action' => 'updated a comment',
        'old_value' => 'Old Content',
        'new_value' => 'New Content'
    ]);
});

test('user can delete their own comment and files are removed', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);
    $file = UploadedFile::fake()->image('to_delete.png');

    post(route('tickets.comments.store', $ticket), [
        'content' => 'Comment to delete',
        'attachments' => [$file]
    ]);

    $commentWithFile = TicketComment::latest('id')->with('attachments')->first();
    $attachment = $commentWithFile->attachments->first();

    expect($attachment)->not->toBeNull();

    $path = $attachment->file_path;
    Storage::disk('public')->assertExists($path);

    delete(route('tickets.comments.destroy', [$ticket, $commentWithFile]))
        ->assertRedirect();

    Storage::disk('public')->assertMissing($path);
    $this->assertSoftDeleted('ticket_comments', ['id' => $commentWithFile->id]);
    $this->assertDatabaseHas('ticket_logs', ['action' => 'comment_deleted']);
});

test('comment posted event constructor loads relations', function () {
    $comment = TicketComment::factory()->create();

    $event = new \App\Events\CommentPosted($comment);

    expect($event->comment->relationLoaded('user'))->toBeTrue()
        ->and($event->comment->relationLoaded('attachments'))->toBeTrue();
});

test('user cannot update someone else comment', function () {
    $ticket = Ticket::factory()->create();
    $other = User::factory()->create();
    $comment = TicketComment::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $other->id
    ]);

    put(route('tickets.comments.update', [$ticket, $comment]), ['content' => 'Hacked'])
        ->assertStatus(403);
});
