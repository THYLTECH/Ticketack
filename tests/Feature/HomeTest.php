<?php

use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use App\Models\Role;

beforeEach(function () {
    // Création manuelle des statuts sans utiliser de Factory
    $this->openStatus = TicketStatus::create([
        'title' => 'Open',
        'color' => '#000000',
        'sort_order' => 1,
        'is_closed' => false
    ]);

    $this->closedStatus = TicketStatus::create([
        'title' => 'Closed',
        'color' => '#111111',
        'sort_order' => 2,
        'is_closed' => true
    ]);
});

test('les invités sont redirigés vers la page de connexion', function () {
    // Utilise le nom de route défini dans auth.php ou web.php (souvent 'login')
    $this->get(route('home'))->assertRedirect(); 
});

test('les utilisateurs authentifiés peuvent accéder à la page home', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('home')
            ->has('userTickets.open')
            ->has('userTickets.closed')
        );
});

test('la page home affiche uniquement les tickets ouverts de l\'utilisateur', function () {
    $user = User::factory()->create();
    $otherUser = User::factory()->create();

    // Ticket de l'utilisateur (on passe l'ID du statut créé dans beforeEach)
    Ticket::factory()->create([
        'author_id' => $user->id,
        'status_id' => $this->openStatus->id,
        'title' => 'Mon ticket ouvert'
    ]);

    // Ticket d'un autre utilisateur
    Ticket::factory()->create([
        'author_id' => $otherUser->id,
        'status_id' => $this->openStatus->id,
        'title' => 'Autre ticket'
    ]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('userTickets.open.data', 1)
            ->where('userTickets.open.data.0.title', 'Mon ticket ouvert')
        );
});

test('les tickets fermés depuis plus de 30 jours ne sont pas affichés', function () {
    $user = User::factory()->create();

    // Ticket fermé récent (10 jours)
    Ticket::factory()->create([
        'author_id' => $user->id,
        'status_id' => $this->closedStatus->id,
        'updated_at' => Carbon::now()->subDays(10)
    ]);

    // Ticket fermé ancien (40 jours)
    Ticket::factory()->create([
        'author_id' => $user->id,
        'status_id' => $this->closedStatus->id,
        'updated_at' => Carbon::now()->subDays(40)
    ]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('userTickets.closed.data', 1)
        );
});

test('un solver voit les tickets qui lui sont attribués', function () {
    // Création du rôle 'solver' manuellement pour le test
    Role::create(['name' => 'solver']);

    $solver = User::factory()->create();
    $solver->assignRole('solver'); 

    $ticket = Ticket::factory()->create([
        'status_id' => $this->openStatus->id,
        'title' => 'Ticket assigné'
    ]);

    // On assigne le ticket au solver
    $ticket->assignees()->create(['user_id' => $solver->id]);

    $this->actingAs($solver)
        ->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('assignedTickets.open.data', 1)
            ->where('assignedTickets.open.data.0.title', 'Ticket assigné')
        );
});

test('un utilisateur normal ne reçoit pas de données de tickets attribués', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(fn (Assert $page) => $page
            ->where('assignedTickets.open', null)
            ->where('assignedTickets.closed', null)
        );
});