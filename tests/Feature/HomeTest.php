<?php

use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

beforeEach(function () {
    // Indispensable pour que les nouveaux rôles/permissions créés dans les tests soient reconnus immédiatement
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    // Création manuelle des statuts nécessaires aux tests
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

    // Ticket appartenant à l'utilisateur
    Ticket::factory()->create([
        'author_id' => $user->id,
        'status_id' => $this->openStatus->id,
        'title' => 'Mon ticket ouvert'
    ]);

    // Ticket appartenant à quelqu'un d'autre
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

    // Ticket fermé récemment (10 jours)
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
    // Création du rôle et de la permission pour passer le contrôle can() ou hasRole() du HomeController
    $role = Role::create(['name' => 'solver']);
    Permission::firstOrCreate(['name' => 'be assigned tickets']);
    $role->givePermissionTo('be assigned tickets');

    $solver = User::factory()->create();
    $solver->assignRole($role); 

    $ticket = Ticket::factory()->create([
        'status_id' => $this->openStatus->id,
        'title' => 'Ticket assigné'
    ]);

    // Assigne explicitement le ticket au solver via la table de pivot
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