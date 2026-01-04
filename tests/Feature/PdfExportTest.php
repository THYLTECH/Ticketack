<?php

namespace Tests\Feature\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs, get};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view tickets']);
    Permission::firstOrCreate(['name' => 'show tickets']);

    $this->user = User::factory()->create(['color_scheme' => 'blue']);
    $this->user->givePermissionTo(['view tickets', 'show tickets']);

    actingAs($this->user);

    Http::fake([
        'api.qrserver.com/*' => Http::response('fake-qr-code-content', 200),
    ]);
});

test('user can download ticket pdf', function () {
    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $response = get(route('tickets.pdf', $ticket));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/pdf')
        ->assertHeader('Content-Disposition', 'attachment; filename=ticket-' . $ticket->id . '.pdf');
});

test('pdf generation handles qr code api failure gracefully', function () {
    Http::fake([
        'api.qrserver.com/*' => Http::response([], 500),
    ]);

    $ticket = Ticket::factory()->create(['author_id' => $this->user->id]);

    $response = get(route('tickets.pdf', $ticket));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');
});

test('pdf export handles ticket without entries', function () {
    $category = \App\Models\TicketCategory::factory()->create();

    $ticket = Ticket::factory()->create([
        'author_id' => $this->user->id,
        'category_id' => $category->id
    ]);

    // Pas d'entries créées exprès
    get(route('tickets.pdf', $ticket))->assertOk();
});
