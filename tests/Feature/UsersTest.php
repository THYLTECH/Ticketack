<?php

namespace Tests\Feature;

use App\Models\User;
use JsonException;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\UserRegistered;
use Spatie\Permission\PermissionRegistrar;
use function Pest\Laravel\{actingAs, delete, get, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {

    Storage::fake('public');

    Permission::firstOrCreate(['name' => 'view users']);
    Permission::firstOrCreate(['name' => 'show users']);
    Permission::firstOrCreate(['name' => 'create users']);
    Permission::firstOrCreate(['name' => 'update users']);
    Permission::firstOrCreate(['name' => 'delete users']);
    Permission::firstOrCreate(['name' => 'restore users']);
    Permission::firstOrCreate(['name' => 'force delete users']);


    $this->roleAdmin = Role::create(['name' => 'Admin']);
    $this->roleBasic = Role::create(['name' => 'simple_user']);

    $this->testUser1 = User::factory()->create();
    $this->testUser1->assignRole($this->roleBasic);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());
    actingAs($this->user);

    app()[PermissionRegistrar::class]->forgetCachedPermissions();
});

test('index loads', function () {
    get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('users/index')
            ->has('users')
            ->has('users.data', 2)
        );
});

test('create loads roles', function () {
    get(route('users.create'))
        ->assertOk()
        ->assertInertia(fn ($page) =>
        $page->component('users/create')->has('roles', 2)
        );
});

test(/**
 * @throws JsonException
 */ /**
 * @throws JsonException
 */ 'store minimal user', function () {
    Notification::fake();

    $response = post(route('users.store'), [
        'name' => 'New User',
        'email' => 'user@test.com',
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => null
    ]);

    $response->assertSessionHasNoErrors();

    $user = User::where('email','user@test.com')->firstOrFail();
    $this->assertTrue($user->hasRole('simple_user'));

    Notification::assertSentTo($user, UserRegistered::class);
});

test('store user with avatar', function () {

    $file = UploadedFile::fake()->image('avatar.png');

    $response = post(route('users.store'), [
        'name' => 'Avatar',
        'email' => 'avatar@test.com',
        'phone' => null,
        'email_verified' => false,
        'roles' => [$this->roleAdmin->id],
        'avatar' => $file,
    ]);

    $response->assertSessionHasNoErrors();

    $user = User::where('email','avatar@test.com')->firstOrFail()->fresh('avatar');
    $this->assertNotNull($user->avatar);
    Storage::disk('public')->assertExists($user->avatar->file_path);
});

test('update avatar add', function () {

    $user = $this->testUser1;

    $file = UploadedFile::fake()->image('new.png');

    $response = post(route('users.update', $user), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file,
    ]);

    $response->assertSessionHasNoErrors();

    $user = $user->fresh('avatar');
    $this->assertNotNull($user->avatar);
});

test('update avatar replace', function () {

    $user = $this->testUser1;

    $old = UploadedFile::fake()->image('old.png');
    post(route('users.update', $user), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $old,
    ]);

    $user = $user->fresh('avatar');
    $oldId = $user->avatar->id;
    $oldPath = $user->avatar->file_path;

    $new = UploadedFile::fake()->image('new.png');

    $response = post(route('users.update', $user), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $new,
    ]);

    $response->assertSessionHasNoErrors();

    $user = $user->fresh('avatar');

    Storage::disk('public')->assertMissing($oldPath);
    $this->assertDatabaseMissing('attachments', ['id' => $oldId]);
    $this->assertEquals('new.png', $user->avatar->file_name);
});

test('update avatar delete', function () {

    $user = $this->testUser1;

    $file = UploadedFile::fake()->image('del.png');
    post(route('users.update', $user), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file,
    ]);

    $user = $user->fresh('avatar');
    $path = $user->avatar->file_path;
    $id = $user->avatar->id;

    $response = post(route('users.update', $user), [
        'name' => $user->name,
        'email' => $user->email,
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => null
    ]);

    $response->assertSessionHasNoErrors();

    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseMissing('attachments',['id'=>$id]);
    $this->assertNull($user->fresh()->avatar);
});

test('delete user keeps avatar for restoration', function () {
    Storage::fake('public');

    $file = UploadedFile::fake()->image('kill.png');

    $store = post(route('users.store'), [
        'name' => 'Delete',
        'email' => 'delete@test.com',
        'phone' => null,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file
    ]);

    $store->assertSessionHasNoErrors();

    $user = User::where('email','delete@test.com')->firstOrFail()->fresh('avatar');

    $this->assertNotNull($user->avatar, 'Avatar not found in DB');
    $path = $user->avatar->file_path;
    $id = $user->avatar->id;

    Storage::disk('public')->assertExists($path);
    $delete = delete(route('users.destroy', $user));
    $delete->assertSessionHasNoErrors();

    $this->assertSoftDeleted('users', ['id' => $user->id]);
    Storage::disk('public')->assertExists($path);
    $this->assertDatabaseHas('attachments', ['id' => $id]);
});

test('user without view permission cannot access index', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('users.index'))
        ->assertForbidden();
});

test('user without show permission cannot view user', function () {
    $user = User::factory()->create();
    $user->givePermissionTo('view users');

    actingAs($user)
        ->get(route('users.show', $this->testUser1))
        ->assertForbidden();
});

test('user without create permission cannot access create page', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('users.create'))
        ->assertForbidden();
});

test('user without create permission cannot store user', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('users.store'), ['name' => 'Test'])
        ->assertForbidden();
});

test('user without update permission cannot access edit page', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('users.edit', $this->testUser1))
        ->assertForbidden();
});

test('user without update permission cannot update user', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->post(route('users.update', $this->testUser1), ['name' => 'Test'])
        ->assertForbidden();
});

test('user without delete permission cannot delete user', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->delete(route('users.destroy', $this->testUser1))
        ->assertForbidden();
});

test('admin bypasses all user permissions', function () {
    $admin = User::factory()->create();
    $adminRole = Role::create(['name' => 'admin']);
    $admin->assignRole($adminRole);

    actingAs($admin)
        ->get(route('users.index'))
        ->assertOk();

    actingAs($admin)
        ->get(route('users.show', $this->testUser1))
        ->assertOk();
});

test('store validates name is required', function () {
    post(route('users.store'), [
        'name' => '',
        'email' => 'test@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['name']);
});

test('store validates email is required', function () {
    post(route('users.store'), [
        'name' => 'Test',
        'email' => '',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['email']);
});

test('store validates email format', function () {
    post(route('users.store'), [
        'name' => 'Test',
        'email' => 'invalid-email',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['email']);
});

test('store validates email is unique', function () {
    post(route('users.store'), [
        'name' => 'Test',
        'email' => $this->testUser1->email,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['email']);
});

test('store validates email_verified is boolean', function () {
    post(route('users.store'), [
        'name' => 'Test',
        'email' => 'test@test.com',
        'email_verified' => 'not-a-boolean',
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['email_verified']);
});

test('store validates roles is required', function () {
    post(route('users.store'), [
        'name' => 'Test',
        'email' => 'test@test.com',
        'email_verified' => true,
        'roles' => []
    ])->assertSessionHasErrors(['roles']);
});

test('store validates role ids exist', function () {
    post(route('users.store'), [
        'name' => 'Test',
        'email' => 'test@test.com',
        'email_verified' => true,
        'roles' => [99999]
    ])->assertSessionHasErrors(['roles.0']);
});

test('store validates avatar mime types', function () {
    $file = UploadedFile::fake()->create('file.pdf', 100);

    post(route('users.store'), [
        'name' => 'Test',
        'email' => 'test@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file
    ])->assertSessionHasErrors(['avatar']);
});

test('store validates avatar max size', function () {
    $file = UploadedFile::fake()->image('huge.jpg')->size(3000);

    post(route('users.store'), [
        'name' => 'Test',
        'email' => 'test@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file
    ])->assertSessionHasErrors(['avatar']);
});

test('update validates email is unique except self', function () {
    $otherUser = User::factory()->create(['email' => 'other@test.com']);

    post(route('users.update', $this->testUser1), [
        'name' => 'Test',
        'email' => $otherUser->email,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['email']);
});

test('update validates name max length', function () {
    post(route('users.update', $this->testUser1), [
        'name' => str_repeat('a', 256),
        'email' => $this->testUser1->email,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['name']);
});

test('update validates phone max length', function () {
    post(route('users.update', $this->testUser1), [
        'name' => 'Test',
        'email' => $this->testUser1->email,
        'phone' => str_repeat('1', 21),
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasErrors(['phone']);
});

test('cannot delete own account', function () {
    delete(route('users.destroy', $this->user))
        ->assertRedirect()
        ->assertSessionHas('error.description', 'You cannot delete your own account.');

    $this->assertDatabaseHas('users', ['id' => $this->user->id]);
});

test('user uses soft deletes', function () {
    delete(route('users.destroy', $this->testUser1));

    $this->assertSoftDeleted('users', ['id' => $this->testUser1->id]);
    expect(User::withTrashed()->find($this->testUser1->id))->not->toBeNull();
});

test('show page loads user with roles and avatar', function () {
    get(route('users.show', $this->testUser1))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('user.roles', 1)
            ->has('user.avatar')
        );
});

test('edit page loads user with roles and avatar', function () {
    get(route('users.edit', $this->testUser1))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('user.roles', 1)
            ->has('user.avatar')
            ->has('roles', 2)
        );
});

test('store assigns multiple roles', function () {
    post(route('users.store'), [
        'name' => 'Multi Role',
        'email' => 'multi@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id, $this->roleAdmin->id]
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'multi@test.com')->first();
    expect($user->roles)->toHaveCount(2);
});

test('update replaces roles', function () {
    $this->testUser1->assignRole($this->roleAdmin);

    post(route('users.update', $this->testUser1), [
        'name' => $this->testUser1->name,
        'email' => $this->testUser1->email,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    expect($this->testUser1->fresh()->roles)->toHaveCount(1)
        ->and($this->testUser1->hasRole('simple_user'))->toBeTrue()
        ->and($this->testUser1->hasRole('Admin'))->toBeFalse();
});

test('store sets email_verified_at when email_verified is true', function () {
    post(route('users.store'), [
        'name' => 'Verified',
        'email' => 'verified@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'verified@test.com')->first();
    expect($user->email_verified_at)->not->toBeNull();
});

test('store sets email_verified_at to null when email_verified is false', function () {
    post(route('users.store'), [
        'name' => 'Not Verified',
        'email' => 'notverified@test.com',
        'email_verified' => false,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'notverified@test.com')->first();
    expect($user->email_verified_at)->toBeNull();
});

test('update changes email verification status', function () {
    $this->testUser1->update(['email_verified_at' => null]);

    post(route('users.update', $this->testUser1), [
        'name' => $this->testUser1->name,
        'email' => $this->testUser1->email,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    expect($this->testUser1->fresh()->email_verified_at)->not->toBeNull();
});

test('index page paginates users', function () {
    User::factory(15)->create();

    get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 10)
            ->has('users.links')
        );
});

test('force delete removes avatar from storage', function () {
    $file = UploadedFile::fake()->image('force.png');

    post(route('users.store'), [
        'name' => 'Force Delete',
        'email' => 'force@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'force@test.com')->first()->fresh('avatar');
    $path = $user->avatar->file_path;
    $attachmentId = $user->avatar->id;

    Storage::disk('public')->assertExists($path);

    $user->delete();

    $this->user->givePermissionTo('force delete users');

    delete(route('users.force-delete', $user->id));

    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseMissing('attachments', ['id' => $attachmentId]);
    $this->assertDatabaseMissing('users', ['id' => $user->id]);
});

test('restore user returns success message', function () {
    $this->testUser1->delete();

    $this->user->givePermissionTo('restore users');

    put(route('users.restore', $this->testUser1->id), [], [
        'HTTP_REFERER' => route('users.index')
    ])
        ->assertRedirect()
        ->assertSessionHas('success');

    $this->assertDatabaseHas('users', [
        'id' => $this->testUser1->id,
        'deleted_at' => null
    ]);
});

test('store hashes password automatically', function () {
    post(route('users.store'), [
        'name' => 'Password Test',
        'email' => 'password@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'password@test.com')->first();
    expect($user->password)->not->toBeNull()
        ->and(strlen($user->password))->toBeGreaterThan(20);
});

test('store sends registration notification', function () {
    Notification::fake();
    post(route('users.store'), [
        'name' => 'Notification Test',
        'email' => 'notification@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'notification@test.com')->first();

    Notification::assertSentTo($user, UserRegistered::class);
});

test('avatar upload creates attachment with correct metadata', function () {
    $file = UploadedFile::fake()->image('metadata.jpg', 100, 100);

    post(route('users.store'), [
        'name' => 'Metadata',
        'email' => 'metadata@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'metadata@test.com')->first();

    $this->assertDatabaseHas('attachments', [
        'id' => $user->avatar->id,
        'file_name' => 'metadata.jpg',
        'mime_type' => 'image/jpeg',
        'file_extension' => 'jpg'
    ]);
});

test('index applies search filter on name', function () {
    User::factory()->create(['name' => 'John Specific']);
    User::factory()->create(['name' => 'Jane Generic']);

    get(route('users.index', ['search' => 'Specific']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.name', 'John Specific')
        );
});

test('index applies search filter on email', function () {
    User::factory()->create(['email' => 'unique@example.com']);
    User::factory()->create(['email' => 'other@example.com']);

    get(route('users.index', ['search' => 'unique']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 1)
            ->where('users.data.0.email', 'unique@example.com')
        );
});

test('index respects per_page parameter', function () {
    User::factory(25)->create();

    get(route('users.index', ['per_page' => 5]))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('users.data', 5)
        );
});

test('update without avatar keeps existing avatar', function () {
    $file = UploadedFile::fake()->image('keep.png');
    post(route('users.store'), [
        'name' => 'Keep Avatar',
        'email' => 'keep@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id],
        'avatar' => $file
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'keep@test.com')->first();
    $avatarId = $user->avatar->id;

    post(route('users.update', $user), [
        'name' => 'Updated Name',
        'email' => $user->email,
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    expect($user->fresh()->avatar->id)->toBe($avatarId);
});

test('user without restore permission cannot restore user', function () {
    $this->testUser1->delete();

    $user = User::factory()->create();
    actingAs($user);

    put(route('users.restore', $this->testUser1->id))
        ->assertForbidden();
});

test('user without force delete permission cannot force delete user', function () {
    $this->testUser1->delete();

    $user = User::factory()->create();
    actingAs($user);

    delete(route('users.force-delete', $this->testUser1->id))
        ->assertForbidden();
});

test('force delete without avatar does not throw error', function () {
    $user = User::factory()->create();
    $user->delete();

    $this->user->givePermissionTo('force delete users');

    delete(route('users.force-delete', $user->id))
        ->assertRedirect()
        ->assertSessionHas('success');
});

test('index returns filters in response', function () {
    get(route('users.index', ['search' => 'test']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('filters.search', 'test')
        );
});

test('user can be updated without roles change', function () {
    $user = User::factory()->create(['name' => 'Original Name']);
    $role = Role::create(['name' => 'Test Role']);
    $user->assignRole($role);

    post(route('users.update', $user), [
        'name' => 'Updated Name',
        'email' => $user->email,
        'email_verified' => true,
        'roles' => [$role->id]
    ])->assertRedirect(route('users.index'));

    $user->refresh();
    expect($user->name)->toBe('Updated Name');
    expect($user->hasRole('Test Role'))->toBeTrue();
});


test('create page loads deleted roles excluded', function () {
    $deletedRole = Role::create(['name' => 'Deleted Role']);
    $deletedRole->delete();

    get(route('users.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('roles', 2)
        );
});

test('store creates user without phone', function () {
    post(route('users.store'), [
        'name' => 'No Phone',
        'email' => 'nophone@test.com',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    $user = User::where('email', 'nophone@test.com')->first();
    expect($user->phone)->toBeNull();
});

test('update can set phone number', function () {
    post(route('users.update', $this->testUser1), [
        'name' => $this->testUser1->name,
        'email' => $this->testUser1->email,
        'phone' => '+33612345678',
        'email_verified' => true,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    expect($this->testUser1->fresh()->phone)->toBe('+33612345678');
});

test('show loads all roles', function () {
    get(route('users.show', $this->testUser1))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('roles')
        );
});

test('update reverts email verification when set to false', function () {
    $this->testUser1->update(['email_verified_at' => now()]);

    post(route('users.update', $this->testUser1), [
        'name' => $this->testUser1->name,
        'email' => $this->testUser1->email,
        'email_verified' => false,
        'roles' => [$this->roleBasic->id]
    ])->assertSessionHasNoErrors();

    expect($this->testUser1->fresh()->email_verified_at)->toBeNull();
});
