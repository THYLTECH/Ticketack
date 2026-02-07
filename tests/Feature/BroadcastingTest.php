<?php

namespace Tests\Feature;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs};

uses(RefreshDatabase::class);

test('authorized user can join ticket channel', function () {
    Permission::firstOrCreate(['name' => 'show tickets']);

    $user = User::factory()->create(['email_verified_at' => now()]);
    $user->givePermissionTo('show tickets');

    $ticket = Ticket::factory()->create(['author_id' => $user->id]);

    $response = actingAs($user)
        ->postJson('/broadcasting/auth', [
            'channel_name' => 'ticket.' . $ticket->id,
            'socket_id' => '1234.5678'
        ]);

    $response->assertStatus(200);
});
