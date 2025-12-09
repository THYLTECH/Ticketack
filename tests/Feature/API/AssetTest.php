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

test('can list assets with pagination', function () {
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

test('can create asset with attributes and parent', function () {
    $parent = Asset::factory()->create();

    withHeaders($this->headers)
        ->postJson('/api/assets', [
            'title' => 'Child Asset',
            'parent_id' => $parent->id,
            'attributes' => [
                ['key' => 'RAM', 'value' => '16GB']
            ]
        ])
        ->assertStatus(201)
        ->assertJsonPath('asset.title', 'Child Asset')
        ->assertJsonPath('asset.parent.id', $parent->id);

    $this->assertDatabaseHas('asset_attributes', ['key' => 'RAM', 'value' => '16GB']);
});

test('can update asset attributes and attachments', function () {
    $asset = Asset::factory()->create();
    $asset->attributes()->create(['key' => 'Color', 'value' => 'Red']);

    $file = UploadedFile::fake()->create('manual.pdf');

    withHeaders($this->headers)
        ->putJson("/api/assets/{$asset->id}", [
            'title' => 'Updated Asset',
            'attributes' => [
                ['key' => 'Color', 'value' => 'Blue']
            ],
            'attachments' => [
                [
                    'title' => 'Manual',
                    'file' => $file
                ]
            ]
        ])
        ->assertStatus(200)
        ->assertJsonPath('asset.title', 'Updated Asset');

    $this->assertDatabaseHas('asset_attributes', ['key' => 'Color', 'value' => 'Blue']);
    $this->assertDatabaseHas('attachments', ['title' => 'Manual']);
});

test('can delete asset (soft delete)', function () {
    $asset = Asset::factory()->create();

    withHeaders($this->headers)
        ->deleteJson("/api/assets/{$asset->id}")
        ->assertStatus(200);

    $this->assertSoftDeleted('assets', ['id' => $asset->id]);
});

test('can delete attachment via api', function () {
    $asset = Asset::factory()->create();
    $attachment = Attachment::factory()->create();
    $asset->attachments()->save($attachment);

    Storage::disk('public')->put($attachment->file_path, 'content');

    withHeaders($this->headers)
        ->deleteJson("/api/attachments/{$attachment->id}")
        ->assertStatus(200);

    $this->assertDatabaseMissing('attachments', ['id' => $attachment->id]);
});
