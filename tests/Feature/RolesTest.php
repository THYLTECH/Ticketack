<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Role;
use JsonException;
use Spatie\Permission\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\PermissionRegistrar;
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

    app()[PermissionRegistrar::class]->forgetCachedPermissions();
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

test(/**
 * @throws JsonException
 */ /**
 * @throws JsonException
 */ 'user can store a new role with permissions and users', function () {
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

test(/**
 * @throws JsonException
 */ 'user can update role name and sync permissions', function () {
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

test(/**
 * @throws JsonException
 */ 'user can delete a role if no users are assigned', function () {
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

test('update role validation fails without name', function () {
    $role = Role::create(['name' => 'Manager']);

    patch(route('roles.update', $role), ['name' => ''])
        ->assertSessionHasErrors('name');
});

test('role update correctly handles empty permissions and users array', function () {
    $role = Role::create(['name' => 'Manager']);

    patch(route('roles.update', $role), [
        'name' => 'Updated Manager',
        'permissions' => [],
        'users' => []
    ])->assertRedirect();

    expect($role->fresh()->name)->toBe('Updated Manager');
});

test('user without view permission cannot access roles index', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('roles.index'))
        ->assertForbidden();
});

test('user without show permission cannot view role', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view roles');

    $role = Role::create(['name' => 'Test Role']);

    actingAs($user)
        ->get(route('roles.show', $role))
        ->assertForbidden();
});

test('user without create permission cannot access create page', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('roles.create'))
        ->assertForbidden();
});

test('user without create permission cannot store role', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('roles.store'), ['name' => 'New Role'])
        ->assertForbidden();
});

test('user without update permission cannot access edit page', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Test Role']);

    actingAs($user)
        ->get(route('roles.edit', $role))
        ->assertForbidden();
});

test('user without update permission cannot update role', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Test Role']);

    actingAs($user)
        ->patch(route('roles.update', $role), ['name' => 'Updated'])
        ->assertForbidden();
});

test('user without delete permission cannot delete role', function () {
    $user = User::factory()->create();
    $role = Role::create(['name' => 'Test Role']);

    actingAs($user)
        ->delete(route('roles.destroy', $role))
        ->assertForbidden();
});

test('admin bypasses all role permissions', function () {
    $admin = User::factory()->create();
    $adminRole = Role::create(['name' => 'admin']);
    $admin->assignRole($adminRole);

    $testRole = Role::create(['name' => 'Test Role']);

    actingAs($admin)
        ->get(route('roles.index'))
        ->assertOk();

    actingAs($admin)
        ->get(route('roles.show', $testRole))
        ->assertOk();
});

test('cannot delete locked admin role', function () {
    $adminRole = Role::create(['name' => 'admin']);

    delete(route('roles.destroy', $adminRole))
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('error');

    $this->assertDatabaseHas('roles', ['id' => $adminRole->id, 'name' => 'admin']);
});

test('cannot delete locked solver role', function () {
    $solverRole = Role::create(['name' => 'solver']);

    delete(route('roles.destroy', $solverRole))
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('error');

    $this->assertDatabaseHas('roles', ['id' => $solverRole->id, 'name' => 'solver']);
});

test('cannot delete locked simple_user role', function () {
    $userRole = Role::create(['name' => 'simple_user']);

    delete(route('roles.destroy', $userRole))
        ->assertRedirect(route('roles.index'))
        ->assertSessionHas('error');

    $this->assertDatabaseHas('roles', ['id' => $userRole->id, 'name' => 'simple_user']);
});

test('index page shows role with user count', function () {
    $role = Role::create(['name' => 'Counter Role']);
    $role->users()->attach([$this->testUser1->id, $this->testUser2->id]);

    get(route('roles.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('roles.0.nbrOfUsers', 2)
        );
});

test('edit page excludes users who already have the role', function () {
    $role = Role::create(['name' => 'Exclusive Role']);
    $role->users()->attach($this->testUser1->id);

    get(route('roles.edit', $role))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('usersWithoutRole')
            ->where('usersWithoutRole', fn ($users) =>
            collect($users)->doesntContain('id', $this->testUser1->id)
            )
        );
});

test('show page excludes users who already have the role', function () {
    $role = Role::create(['name' => 'Display Role']);
    $role->users()->attach($this->testUser1->id);

    get(route('roles.show', $role))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('usersWithoutRole')
            ->where('usersWithoutRole', fn ($users) =>
            collect($users)->doesntContain('id', $this->testUser1->id)
            )
        );
});

test('store validates name is required', function () {
    post(route('roles.store'), ['name' => ''])
        ->assertSessionHasErrors(['name']);
});

test('store validates name is unique', function () {
    Role::create(['name' => 'Duplicate']);

    post(route('roles.store'), ['name' => 'Duplicate'])
        ->assertSessionHasErrors(['name']);
});

test('store validates name max length', function () {
    post(route('roles.store'), ['name' => str_repeat('a', 256)])
        ->assertSessionHasErrors(['name']);
});

test('update validates name is required', function () {
    $role = Role::create(['name' => 'Test']);

    patch(route('roles.update', $role), [
        'name' => '',
        'permissions' => [],
        'users' => []
    ])->assertSessionHasErrors(['name']);
});

test('update validates name is unique except self', function () {
    Role::create(['name' => 'Existing']);
    $role = Role::create(['name' => 'Original']);

    patch(route('roles.update', $role), [
        'name' => 'Existing',
        'permissions' => [],
        'users' => []
    ])->assertSessionHasErrors(['name']);
});

test('store syncs only valid permission ids', function () {
    $validPermission = Permission::firstWhere('name', 'view roles');

    post(route('roles.store'), [
        'name' => 'Validated Role',
        'permissions' => [
            ['id' => $validPermission->id],
            ['id' => 99999]
        ],
        'users' => []
    ])->assertSessionHasErrors(['permissions.1.id']);

    expect(Role::where('name', 'Validated Role')->first())->toBeNull();
});

test('store syncs only valid user ids', function () {
    post(route('roles.store'), [
        'name' => 'Validated Users',
        'permissions' => [],
        'users' => [
            ['id' => $this->testUser1->id],
            ['id' => 99999]
        ]
    ])->assertSessionHasErrors(['users.1.id']);

    expect(Role::where('name', 'Validated Users')->first())->toBeNull();
});


test('update removes all permissions when empty array provided', function () {
    $role = Role::create(['name' => 'Clear Permissions']);
    $role->syncPermissions(['view roles', 'edit articles']);

    patch(route('roles.update', $role), [
        'name' => 'Clear Permissions',
        'permissions' => [],
        'users' => []
    ]);

    expect($role->fresh()->permissions)->toHaveCount(0);
});

test('update removes all users when empty array provided', function () {
    $role = Role::create(['name' => 'Clear Users']);
    $role->users()->attach([$this->testUser1->id, $this->testUser2->id]);

    patch(route('roles.update', $role), [
        'name' => 'Clear Users',
        'permissions' => [],
        'users' => []
    ]);

    expect($role->fresh()->users)->toHaveCount(0);
});

test('role uses soft deletes', function () {
    $role = Role::create(['name' => 'Soft Delete Test']);

    delete(route('roles.destroy', $role));

    $this->assertSoftDeleted('roles', ['id' => $role->id]);
    expect(Role::withTrashed()->find($role->id))->not->toBeNull();
});

test('deleted role can be restored', function () {
    $role = Role::create(['name' => 'Restorable']);
    $role->delete();

    $role->restore();

    $this->assertDatabaseHas('roles', [
        'id' => $role->id,
        'deleted_at' => null
    ]);
});

test('index page loads roles with permissions relationship', function () {
    $role = Role::create(['name' => 'With Permissions']);
    $role->syncPermissions(['view roles']);

    get(route('roles.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('roles.0.permissions', 1)
        );
});

test('edit page loads role with permissions and users relationships', function () {
    $role = Role::create(['name' => 'Full Load']);
    $role->syncPermissions(['view roles']);
    $role->users()->attach($this->testUser1->id);

    get(route('roles.edit', $role))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('role.permissions', 1)
            ->has('role.users', 1)
        );
});

test('show page loads role with permissions and users relationships', function () {
    $role = Role::create(['name' => 'Full Display']);
    $role->syncPermissions(['view roles']);
    $role->users()->attach($this->testUser1->id);

    get(route('roles.show', $role))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('role.permissions', 1)
            ->has('role.users', 1)
        );
});

test('delete returns correct error message for locked roles', function () {
    $adminRole = Role::create(['name' => 'admin']);

    delete(route('roles.destroy', $adminRole))
        ->assertSessionHas('error.title', __('common.flash.error'))
        ->assertSessionHas('error.description', __('roles.flash.delete_locked'));
});

test('delete returns correct error message when users are assigned', function () {
    $role = Role::create(['name' => 'Has Users']);
    $role->users()->attach($this->testUser1->id);

    delete(route('roles.destroy', $role))
        ->assertSessionHas('error.title', __('common.flash.error'))
        ->assertSessionHas('error.description', __('roles.flash.delete_error'));
});

test('create page returns all permissions', function () {
    get(route('roles.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('permissions', Permission::count())
        );
});

test('edit page returns all permissions including those not assigned', function () {
    $role = Role::create(['name' => 'Partial Permissions']);
    $role->syncPermissions(['view roles']);

    get(route('roles.edit', $role))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('permissions', Permission::count())
        );
});
