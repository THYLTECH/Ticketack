<?php

use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use App\Models\TicketEntry;
use App\Models\TicketSchedule;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use App\Models\Setting;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;
use Illuminate\Support\Facades\Route;

function openStatus()
{
    return TicketStatus::where('title', 'Open')->first();
}

function closedStatus()
{
    return TicketStatus::where('title', 'Closed')->first();
}

beforeEach(function () {
    app()[PermissionRegistrar::class]->forgetCachedPermissions();

    TicketStatus::firstOrCreate(['title' => 'Open'], [
        'color' => '#000000',
        'sort_order' => 1,
        'is_closed' => false
    ]);

    TicketStatus::firstOrCreate(['title' => 'Closed'], [
        'color' => '#111111',
        'sort_order' => 2,
        'is_closed' => true
    ]);

    if (!Route::has('login')) {
        Route::get('/login-mock', fn() => 'Login Page')->name('login');
    }
});

test('les invités sont redirigés vers la page de connexion', function () {
    $this->get(route('home'))->assertRedirect(route('auth.login'));
});


test('mode default : affiche les statistiques et les tickets récents', function () {
    $user = User::factory()->create(['home_page_mode' => 'default']);

    Ticket::factory()->count(3)->create([
        'author_id' => $user->id,
        'status_id' => openStatus()->id
    ]);

    Ticket::factory()->count(2)->create([
        'author_id' => $user->id,
        'status_id' => closedStatus()->id,
        'updated_at' => Carbon::now()
    ]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertOk()
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('home')
                ->where('home_page_mode', 'default')
                ->has('stats.user.open')
                ->where('stats.user.open', 3)
                ->where('stats.user.closed', 2)
                ->has('recentUserTickets', 3)
                ->has('recentUserClosedTickets', 2)
        );
});

test('mode default : un solver voit les tickets assignés et stats', function () {
    $role = Role::create(['name' => 'solver']);
    Permission::firstOrCreate(['name' => 'be assigned tickets']);
    $role->givePermissionTo('be assigned tickets');

    $user = User::factory()->create(['home_page_mode' => 'default']);
    $user->assignRole($role);

    $ticket = Ticket::factory()->create(['status_id' => openStatus()->id]);
    $ticket->assignees()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->has('assignedTickets', 1)
                ->has('stats.assigned')
                ->where('stats.assigned.open', 1)
        );
});

test('mode default : voir les entrées de temps', function () {
    $role = Role::create(['name' => 'timer']);
    Permission::firstOrCreate(['name' => 'view ticket entries']);
    $role->givePermissionTo('view ticket entries');

    $user = User::factory()->create(['home_page_mode' => 'default']);
    $user->assignRole($role);

    $this->actingAs($user);

    $ticket = Ticket::factory()->create();
    TicketEntry::factory()->create([
        'user_id' => $user->id,
        'ticket_id' => $ticket->id,
        'start_at' => Carbon::now()->subHour(),
        'end_at' => Carbon::now(),
        'duration_seconds' => 3600
    ]);

    $this->get(route('home'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->where('stats.weekly_hours', 1)
                ->has('recentEntries', 1)
        );
});

test('mode default : voir le planning', function () {
    $role = Role::create(['name' => 'planner']);
    Permission::firstOrCreate(['name' => 'view planning']);
    $role->givePermissionTo('view planning');

    $user = User::factory()->create(['home_page_mode' => 'default']);
    $user->assignRole($role);

    $this->actingAs($user);

    $ticket = Ticket::factory()->create();
    TicketSchedule::factory()->create([
        'user_id' => $user->id,
        'ticket_id' => $ticket->id,
        'start_date' => Carbon::tomorrow()
    ]);

    $this->get(route('home'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->has('upcomingSchedules', 1)
        );
});

test('mode default : voir le dashboard admin', function () {
    $role = Role::create(['name' => 'admin']);
    Permission::firstOrCreate(['name' => 'view dashboard']);
    $role->givePermissionTo('view dashboard');

    $user = User::factory()->create(['home_page_mode' => 'default']);
    $user->assignRole($role);

    Ticket::factory()->create(['status_id' => openStatus()->id]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->has('stats.admin')
                ->where('stats.admin.total_open', 1)
                ->has('recentActivity', 1)
        );
});



test('mode classic : affiche les tickets paginés', function () {
    $user = User::factory()->create(['home_page_mode' => 'classic']);

    Ticket::factory()->create([
        'author_id' => $user->id,
        'status_id' => openStatus()->id,
        'title' => 'Classic Mode Ticket'
    ]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->component('home')
                ->where('home_page_mode', 'classic')
                ->has('userTickets.open.data', 1)
                ->where('userTickets.open.data.0.title', 'Classic Mode Ticket')
        );
});

test('mode classic : tickets assignés paginés pour les solvers', function () {
    $role = Role::create(['name' => 'solver']);
    Permission::firstOrCreate(['name' => 'be assigned tickets']);
    $role->givePermissionTo('be assigned tickets');

    $user = User::factory()->create(['home_page_mode' => 'classic']);
    $user->assignRole($role);

    $ticket = Ticket::factory()->create(['status_id' => openStatus()->id]);
    $ticket->assignees()->create(['user_id' => $user->id]);

    $this->actingAs($user)
        ->get(route('home'))
        ->assertInertia(
            fn(Assert $page) => $page
                ->has('assignedTickets.open.data', 1)
        );
});



test('settings : mise à jour du mode et du layout', function () {
    $user = User::factory()->create(['home_page_mode' => 'default']);

    $newLayout = [
        'top' => [['id' => 'stat_open', 'visible' => true]],
        'left' => [],
        'right' => []
    ];

    $this->actingAs($user)
        ->post(route('home.settings'), [
            'home_page_mode' => 'classic',
            'home_page_layout' => $newLayout
        ])
        ->assertRedirect();

    $user->refresh();
    expect($user->home_page_mode)->toBe('classic');
    expect($user->home_page_layout)->toBe($newLayout);
});

test('settings : validation des données', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('home.settings'), [
            'home_page_mode' => 'invalid_mode',
        ])
        ->assertSessionHasErrors('home_page_mode');
});

test('settings : un admin peut basculer la bannière globale', function () {
    $role = Role::create(['name' => 'admin']);
    Permission::firstOrCreate(['name' => 'view dashboard']);
    $role->givePermissionTo('view dashboard');

    $user = User::factory()->create();
    $user->assignRole($role);


    $this->actingAs($user)
        ->post(route('home.toggle-global-banner'))
        ->assertRedirect();

    $setting = Setting::where('key', 'home_page_global_banner')->first();
    expect($setting->value)->toBeFalse();

    $this->actingAs($user)
        ->post(route('home.toggle-global-banner'))
        ->assertRedirect();

    $setting->refresh();
    expect($setting->value)->toBeTrue();
});

test('settings : un utilisateur non-admin ne peut pas basculer la bannière globale', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('home.toggle-global-banner'))
        ->assertStatus(403);
});