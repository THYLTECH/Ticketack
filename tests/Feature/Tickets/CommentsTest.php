<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs, delete, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view tickets']);
    Permission::firstOrCreate(['name' => 'show tickets']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());

    actingAs($this->user);
    Storage::fake('public');

    /**
     * On fake les évènements pour éviter que le ShouldBroadcastNow
     * n'essaie de charger des relations sur un modèle supprimé.
     */
    Event::fake();
});

test('user can add a comment', function () {
    $ticket = Ticket::factory()->create();

    post(route('tickets.comments.store', $ticket), ['content' => 'Hello'])
        ->assertRedirect();

    $this->assertDatabaseHas('ticket_comments', [
        'ticket_id' => $ticket->id,
        'content' => 'Hello'
    ]);
});

test('user can update their own comment', function () {
    $ticket = Ticket::factory()->create();
    $comment = TicketComment::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id
    ]);

    put(route('tickets.comments.update', [$ticket, $comment]), ['content' => 'Updated'])
        ->assertRedirect();

    $this->assertDatabaseHas('ticket_comments', ['content' => 'Updated']);
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

test('user can delete their own comment', function () {
    $ticket = Ticket::factory()->create();
    $comment = TicketComment::factory()->create([
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id
    ]);

    delete(route('tickets.comments.destroy', [$ticket, $comment]))
        ->assertRedirect();

    $this->assertSoftDeleted('ticket_comments', ['id' => $comment->id]);
});

test('comment validation length', function () {
    $ticket = Ticket::factory()->create();

    post(route('tickets.comments.store', $ticket), ['content' => str_repeat('a', 5001)])
        ->assertSessionHasErrors('content');
});
