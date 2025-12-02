<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Attachment;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use App\Notifications\UserRegistered;
use function Pest\Laravel\{actingAs, delete, get, post};

uses(RefreshDatabase::class);

beforeEach(function () {

    Storage::fake('public');
    Notification::fake();

    Permission::firstOrCreate(['name' => 'view users']);
    Permission::firstOrCreate(['name' => 'show users']);
    Permission::firstOrCreate(['name' => 'create users']);
    Permission::firstOrCreate(['name' => 'update users']);
    Permission::firstOrCreate(['name' => 'delete users']);

    $this->roleAdmin = Role::create(['name' => 'Admin']);
    $this->roleBasic = Role::create(['name' => 'Basic User']);

    $this->testUser1 = User::factory()->create();
    $this->testUser1->assignRole($this->roleBasic);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());
    actingAs($this->user);

    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
});

test('index loads', function () {
    get(route('users.index'))
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('users/index')->has('users', 2)
        );
});

test('create loads roles', function () {
    get(route('users.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => 
            $page->component('users/create')->has('roles', 2)
        );
});

test('store minimal user', function () {

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
    $this->assertTrue($user->hasRole('Basic User'));

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

    // ancien
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

    // nouveau
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

    // création avatar
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

    // suppression
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

test('delete user and avatar', function () {

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

    $path = $user->avatar->file_path;
    $id = $user->avatar->id;

    $delete = delete(route('users.destroy', $user));
    $delete->assertSessionHasNoErrors();

    Storage::disk('public')->assertMissing($path);
    $this->assertDatabaseMissing('attachments',['id'=>$id]);
    $this->assertDatabaseMissing('users',['id'=>$user->id]);
});
