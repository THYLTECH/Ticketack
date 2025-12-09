<?php

use App\Models\User;
use App\Models\Asset;
use App\Models\Attachment;
use Spatie\Permission\Models\Permission;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use function Pest\Laravel\withHeaders;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('public');
    app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

    Permission::firstOrCreate(['name' => 'view assets', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'create assets', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'update assets', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'delete assets', 'guard_name' => 'web']);
    Permission::firstOrCreate(['name' => 'show assets', 'guard_name' => 'web']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all());

    $this->token = $this->user->createToken('test')->plainTextToken;
    $this->headers = ['Authorization' => 'Bearer ' . $this->token];
});

test('can list assets', function () {
    Asset::factory()->count(3)->create();

    withHeaders($this->headers)
        ->getJson('/api/assets')
        ->assertStatus(200)
        ->assertJsonStructure(['data', 'links', 'meta']);
});

test('can show asset', function () {
    $asset = Asset::factory()->create();

    withHeaders($this->headers)
        ->getJson("/api/assets/{$asset->id}")
        ->assertStatus(200)
        ->assertJsonPath('data.title', $asset->title);
});

test('can create asset', function () {
    withHeaders($this->headers)
        ->postJson('/api/assets', [
            'title' => 'MacBook Pro',
            'description' => 'Laptop dev',
        ])
        ->assertStatus(201)
        ->assertJsonPath('asset.title', 'MacBook Pro');

    $this->assertDatabaseHas('assets', ['title' => 'MacBook Pro']);
});

test('can update asset', function () {
    $asset = Asset::factory()->create();

    withHeaders($this->headers)
        ->putJson("/api/assets/{$asset->id}", [
            'title' => 'Updated Title',
            'description' => 'Updated Desc',
        ])
        ->assertStatus(200)
        ->assertJsonPath('asset.title', 'Updated Title');

    $this->assertDatabaseHas('assets', ['id' => $asset->id, 'title' => 'Updated Title']);
});

test('can delete asset', function () {
    $asset = Asset::factory()->create();

    withHeaders($this->headers)
        ->deleteJson("/api/assets/{$asset->id}")
        ->assertStatus(200);

    $this->assertSoftDeleted('assets', ['id' => $asset->id]);
});


