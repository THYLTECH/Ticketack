<?php

use App\Models\User;
use Illuminate\Support\Facades\Auth;

test('profile page is displayed', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->get(route('settings.profile.edit'));

    $response->assertOk();
});

test('profile information can be updated', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
        'phone' => null,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update'), [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'phone' => '+33611223344',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.profile.edit'));

    $user->refresh();

    expect($user->name)->toBe('Test User');
    expect($user->email)->toBe('test@example.com');
    expect($user->phone)->toBe('+33611223344');
    expect($user->email_verified_at)->toBeNull();
});

test('email verification status is unchanged when the email address is unchanged', function () {
    $user = User::factory()->create([
        'email_verified_at' => now(),
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update'), [
            'name' => 'Test User',
            'email' => $user->email,
            'phone' => null,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.profile.edit'));

    expect($user->refresh()->email_verified_at)->not->toBeNull();
});

test('language and timezone can be updated', function () {
    $user = User::factory()->create([
        'language' => 'en',
        'timezone' => 'UTC',
    ]);

    $validLanguage = config('preferences.languages')[0]['code'];
    $validTimezone = config('preferences.timezones')[0]['value'];

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update_lang'), [
            'language' => $validLanguage,
            'timezone' => $validTimezone,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('settings.profile.edit'));

    $user->refresh();

    expect($user->language)->toBe($validLanguage);
    expect($user->timezone)->toBe($validTimezone);
});

test('invalid language is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update_lang'), [
            'language' => 'invalid_lang',
            'timezone' => 'UTC',
        ]);

    $response->assertSessionHasErrors('language');
});

test('invalid timezone is rejected', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update_lang'), [
            'language' => 'en',
            'timezone' => 'invalid_timezone',
        ]);

    $response->assertSessionHasErrors('timezone');
});

test('user can delete their account', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this
        ->actingAs($user)
        ->delete(route('settings.profile.destroy'), [
            'password' => 'password',
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('home'));

    $this->assertGuest();

    $user = $user->fresh();

    expect($user)->not->toBeNull();
    expect($user->deleted_at)->not->toBeNull();

});
test('correct password must be provided to delete account', function () {
    $user = User::factory()->create([
        'password' => bcrypt('password'),
    ]);

    $response = $this
        ->actingAs($user)
        ->from(route('settings.profile.edit'))
        ->delete(route('settings.profile.destroy'), [
            'password' => 'wrong-password',
        ]);

    $response
        ->assertSessionHasErrors('password')
        ->assertRedirect(route('settings.profile.edit'));

    expect($user->fresh())->not->toBeNull();
});

test('phone number is formatted to remove spaces', function () {
    $user = User::factory()->create([
        'phone' => null,
    ]);

    $response = $this
        ->actingAs($user)
        ->patch(route('settings.profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'phone' => '+33 6 12 34 56 78', // Avec espaces et format international
        ]);

    $response->assertSessionHasNoErrors();

    // Vérifie que les espaces sont retirés en BDD
    expect($user->refresh()->phone)->toBe('+33612345678');
});

test('last admin cannot delete their account', function () {
    // Création du rôle admin si nécessaire (adapter selon votre gestion des rôles)
    $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);

    $user = User::factory()->create(['password' => bcrypt('password')]);
    $user->assignRole('admin');

    // On s'assure qu'il est le seul admin
    expect(User::role('admin')->count())->toBe(1);

    $response = $this
        ->actingAs($user)
        ->delete(route('settings.profile.destroy'), [
            'password' => 'password',
        ]);

    // Doit rediriger avec une erreur (flash 'error')
    $response->assertRedirect();
    $response->assertSessionHas('error');

    // L'utilisateur ne doit PAS être supprimé
    expect($user->fresh()->deleted_at)->toBeNull();
});

test('admin can delete account if other admins exist', function () {
    $role = \Spatie\Permission\Models\Role::firstOrCreate(['name' => 'admin']);

    // Créer un autre admin
    $otherAdmin = User::factory()->create();
    $otherAdmin->assignRole('admin');

    // Créer l'admin à supprimer
    $user = User::factory()->create(['password' => bcrypt('password')]);
    $user->assignRole('admin');

    $response = $this
        ->actingAs($user)
        ->delete(route('settings.profile.destroy'), [
            'password' => 'password',
        ]);

    $response->assertSessionHas('success');

    // L'utilisateur doit être supprimé (Soft Delete)
    expect($user->fresh()->deleted_at)->not->toBeNull();
});
