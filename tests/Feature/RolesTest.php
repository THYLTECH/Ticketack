<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use function Pest\Laravel\{actingAs, delete, get, post, patch};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::firstOrCreate(['name' => 'view roles']);
    Permission::firstOrCreate(['name' => 'show roles']);
    Permission::firstOrCreate(['name' => 'create roles']);
    Permission::firstOrCreate(['name' => 'update roles']);
    Permission::firstOrCreate(['name' => 'delete roles']);

    Permission::firstOrCreate(['name' => 'edit articles']);
    $this->testUser1 = User::factory()->create();
    $this->testUser2 = User::factory()->create();

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());
    $this->user = $this->user->fresh();

    actingAs($this->user);

    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
});

test('role index page loads and shows roles', function () {
    Role::create(['name' => 'Admin']);
    Role::create(['name' => 'Guest']);

    $response = get(route('roles.index'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('roles/index')
            ->has('roles', 2)
        );
});

test('role create page loads and passes necessary data', function () {
    $response = get(route('roles.create'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('roles/create')
            ->has('permissions')
            ->has('usersWithoutRole')
        );
});

test('role show page loads and passes necessary data', function () {
    $role = Role::create(['name' => 'Viewer']);
    $role->users()->attach($this->testUser1->id);

    $response = get(route('roles.show', $role));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('roles/show')
            ->where('role.name', 'Viewer')
            ->has('role.users', 1)
            ->has('usersWithoutRole')
        );
});

test('role edit page loads and passes necessary data', function () {
    $role = Role::create(['name' => 'Editor']);
    $permission = Permission::firstWhere('name', 'edit articles');
    $role->syncPermissions([$permission->name]);

    $response = get(route('roles.edit', $role));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('roles/edit')
            ->where('role.name', 'Editor')
            ->has('role.permissions', 1)
            ->has('usersWithoutRole')
        );
});

test('role routes return 404 if role does not exist', function () {
    get(route('roles.show', 999))->assertStatus(404);
    get(route('roles.edit', 999))->assertStatus(404);
});

test('user can store a new role with minimum data', function () {
    $data = ['name' => 'Basic User'];

    $response = post(route('roles.store'), $data);

    $role = Role::where('name', 'Basic User')->first();

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('roles.show', ['role' => $role->id]))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('roles', ['name' => 'Basic User']);
    $this->assertCount(0, $role->permissions);
    $this->assertCount(0, $role->users);
});

test('user can store a new role with permissions and users', function () {
    $p1 = Permission::firstWhere('name', 'view roles');
    $p2 = Permission::firstWhere('name', 'edit articles');

    $data = [
        'name' => 'Power User',
        'permissions' => [['id' => $p1->id], ['id' => $p2->id]],
        'users' => [['id' => $this->testUser1->id], ['id' => $this->testUser2->id]],
    ];

    $response = post(route('roles.store'), $data);

    $role = Role::where('name', 'Power User')->first();

    $response->assertSessionHasNoErrors();
    $this->assertDatabaseHas('roles', ['name' => 'Power User']);

    $this->assertCount(2, $role->permissions);
    $this->assertCount(2, $role->users);
    $this->assertTrue($this->testUser1->fresh()->hasRole('Power User'));
});

test('store fails on duplicate role name', function () {
    Role::create(['name' => 'Existing Role']);

    $initialRoleCount = Role::count();

    $data = ['name' => 'Existing Role'];

    post(route('roles.store'), $data)
        ->assertSessionHasErrors('name');

    $this->assertDatabaseCount('roles', $initialRoleCount);
});

test('user can update role name and sync permissions', function () {
    $role = Role::create(['name' => 'Old Name']);
    $p_new = Permission::firstWhere('name', 'edit articles');

    $data = [
        'name' => 'New Role Name',
        'permissions' => [['id' => $p_new->id]],
        'users' => [],
    ];

    $response = patch(route('roles.update', $role), $data);

    $role->refresh();

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('roles.show', $role))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'New Role Name']);
    $this->assertCount(1, $role->permissions);
    $this->assertTrue($role->hasPermissionTo('edit articles'));
});

test('user can sync users during role update (add and remove)', function () {
    $role = Role::create(['name' => 'Test Role']);

    $role->users()->sync([$this->testUser1->id, $this->testUser2->id]);

    $data = [
        'name' => $role->name,
        'permissions' => [],
        'users' => [['id' => $this->testUser2->id], ['id' => $this->user->id]],
    ];

    patch(route('roles.update', $role), $data);

    $role->refresh();

    $this->assertCount(2, $role->users);
    $this->assertFalse($this->testUser1->fresh()->hasRole('Test Role'));
    $this->assertTrue($this->testUser2->fresh()->hasRole('Test Role'));
    $this->assertTrue($this->user->fresh()->hasRole('Test Role'));
});

test('update fails on duplicate role name (except self)', function () {
    Role::create(['name' => 'Existing Role']);
    $roleToUpdate = Role::create(['name' => 'Original Name']);

    $data = [
        'name' => 'Existing Role',
        'permissions' => [],
        'users' => [],
    ];

    patch(route('roles.update', $roleToUpdate), $data)
        ->assertSessionHasErrors('name');

    $data_ok = [
        'name' => 'Original Name',
        'permissions' => [],
        'users' => [],
    ];
    patch(route('roles.update', $roleToUpdate), $data_ok)
        ->assertSessionHasNoErrors();
});

test('user can delete a role if no users are assigned', function () {
    $role = Role::create(['name' => 'Deletable Role']);

    $response = delete(route('roles.destroy', $role));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('success');

    $this->assertSoftDeleted('roles', ['id' => $role->id]);});

test('user cannot delete a role if users are assigned', function () {
    $role = Role::create(['name' => 'Locked Role']);
    $this->testUser1->assignRole($role);

    $response = delete(route('roles.destroy', $role));

    $response
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('error');

    $this->assertDatabaseHas('roles', ['id' => $role->id]);
    $this->assertTrue($this->testUser1->fresh()->hasRole('Locked Role'));
});
