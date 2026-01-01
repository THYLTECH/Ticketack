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

    $this->user = User::factory()->create(['color_scheme' => 'blue']);
    $this->user->givePermissionTo('view tickets');

    actingAs($this->user);

    /**
     * On mock l'appel HTTP pour éviter de dépendre de l'API externe
     * et pour accélérer les tests.
     */
    Http::fake([
        'api.qrserver.com/*' => Http::response('fake-qr-code-content', 200),
    ]);
});

test('user can download ticket pdf', function () {
    $ticket = Ticket::factory()->create();

    $response = get(route('tickets.pdf', $ticket));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/pdf')
        ->assertHeader('Content-Disposition', 'attachment; filename=ticket-' . $ticket->id . '.pdf');
});

test('pdf generation handles qr code api failure gracefully', function () {
    Http::fake([
        'api.qrserver.com/*' => Http::response([], 500),
    ]);

    $ticket = Ticket::factory()->create();

    $response = get(route('tickets.pdf', $ticket));

    $response->assertOk()
        ->assertHeader('Content-Type', 'application/pdf');
});
