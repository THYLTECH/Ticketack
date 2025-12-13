<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'view tickets']);
    Permission::create(['name' => 'show tickets']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());
    actingAs($this->user);
});

test('user can add a comment to a ticket', function () {
    $ticket = Ticket::factory()->create();

    $commentData = ['content' => 'Ceci est un commentaire de test'];

    post(route('tickets.comments.store', $ticket), $commentData)
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('ticket_comments', [
        'ticket_id' => $ticket->id,
        'user_id' => $this->user->id,
        'content' => 'Ceci est un commentaire de test'
    ]);
});

test('comment validation requires content', function () {
    $ticket = Ticket::factory()->create();

    post(route('tickets.comments.store', $ticket), ['content' => ''])
        ->assertSessionHasErrors('content');
});

test('comment validation fails if content is too long', function () {
    $ticket = Ticket::factory()->create();

    $longContent = str_repeat('a', 2001);

    post(route('tickets.comments.store', $ticket), ['content' => $longContent])
        ->assertSessionHasErrors('content');
});
