<?php

use App\Models\User;
use App\Models\Ticket;
use App\Models\Asset;
use App\Models\TicketStatus;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Illuminate\Foundation\Testing\RefreshDatabase;

// Utilise RefreshDatabase pour nettoyer la base de données avant chaque test
uses(RefreshDatabase::class);

test('le dashboard affiche les statistiques correctes pour un utilisateur authentifié', function () {
    $user = User::factory()->create();
    
    $status = TicketStatus::create([
        'title' => 'Open',
        'color' => '#000000',
        'is_closed' => false,
        'sort_order' => 1
    ]);

    // 1. On crée les 3 assets et on les récupère dans une variable
    $assets = Asset::factory()->count(3)->create();

    // 2. On crée 5 tickets en précisant l'asset_id pour éviter que la factory n'en crée d'autres
    Ticket::factory()->count(5)->create([
        'author_id' => $user->id,
        'status_id' => $status->id,
        'asset_id' => $assets->first()->id,
        'created_at' => Carbon::now()->startOfMonth()
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('dashboard')
                ->has('statsGeneral', fn(Assert $stats) => $stats
                    ->where('total_assets', 3)
                    ->where('total_users', 1)
                    ->has('activity')
                    ->etc()
                )
                ->has('statsUsers.by_created.0', fn(Assert $pageUser) => $pageUser
                    ->where('id', $user->id)
                    ->where('tickets_count', 5)
                    ->etc()
                )
        );
});

test('le dashboard filtre les données par plage de dates', function () {
    $user = User::factory()->create();
    
    $status = TicketStatus::create([
        'title' => 'Open',
        'color' => '#000000',
        'is_closed' => false,
        'sort_order' => 1
    ]);

    // Ticket hors période (mois dernier)
    Ticket::factory()->create([
        'status_id' => $status->id,
        'created_at' => Carbon::now()->subMonth()
    ]);
    
    // Ticket dans la période (ce mois-ci)
    Ticket::factory()->create([
        'status_id' => $status->id,
        'created_at' => Carbon::now()
    ]);

    $start = Carbon::now()->startOfMonth()->toDateString();
    $end = Carbon::now()->endOfMonth()->toDateString();

    $this->actingAs($user)
        ->get(route('dashboard', ['start_date' => $start, 'end_date' => $end]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('statsTickets.total', 1)
        );
});