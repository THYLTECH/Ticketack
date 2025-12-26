<?php

use App\Models\User;
use App\Models\Ticket;
use App\Models\Asset;
use App\Models\TicketStatus;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;

test('le dashboard affiche les statistiques correctes pour un utilisateur authentifié', function () {
    $user = User::factory()->create();
    $status = TicketStatus::factory()->create(['is_closed' => false]);
    Asset::factory()->count(3)->create();
    Ticket::factory()->count(5)->create([
        'author_id' => $user->id,
        'status_id' => $status->id,
        'created_at' => Carbon::now()->startOfMonth()
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->has('statsGeneral', fn (Assert $stats) => $stats
                ->where('total_assets', 3)
                ->where('total_users', 1)
                ->has('activity')
                ->etc()
            )
            ->has('statsTickets')
            ->has('statsUsers')
            ->has('statsAssets')
        );
});

test('le dashboard filtre les données par plage de dates', function () {
    $user = User::factory()->create();
    
    Ticket::factory()->create(['created_at' => Carbon::now()->subMonth()]);
    Ticket::factory()->create(['created_at' => Carbon::now()]);

    $start = Carbon::now()->startOfMonth()->toDateString();
    $end = Carbon::now()->endOfMonth()->toDateString();

    $this->actingAs($user)
        ->get(route('dashboard', ['start_date' => $start, 'end_date' => $end]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('statsTickets.total', 1)
        );
});