<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\Attachment;
use App\Models\AssetAttachment; 
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use function Pest\Laravel\{actingAs, delete, get, post};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'view assets']);
    Permission::create(['name' => 'show assets']);
    Permission::create(['name' => 'create assets']);
    Permission::create(['name' => 'update assets']);
    Permission::create(['name' => 'delete assets']);

    $this->user = User::factory()->create();
    $this->user->givePermissionTo(Permission::all()); 
    
    actingAs($this->user);

    Storage::fake('public');
});

test('asset index page loads and shows assets', function () {
    Asset::factory()->count(3)->create();
    $response = get(route('assets.index'));
    
    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('assets/index'));
});

test('asset create page loads and passes necessary data', function () {
    $response = get(route('assets.create'));
    
    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('assets/create')
            ->has('assets')
            ->has('attribute_keys')
        );
});

test('asset show page loads', function () {
    $asset = Asset::factory()->create();
    $response = get(route('assets.show', $asset));
    
    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('assets/show')
            ->where('asset.id', $asset->id)
        );
});

test('asset edit page loads and passes necessary data', function () {
    $asset = Asset::factory()->create();
    $response = get(route('assets.edit', $asset));
    
    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page->component('assets/edit')
            ->where('asset.id', $asset->id)
            ->has('assets')
            ->has('attribute_keys')
        );
});

test('asset edit returns 404 if asset does not exist', function () {
    $response = get(route('assets.edit', 999));
    $response->assertStatus(404);
});

test('asset show returns 404 if asset does not exist', function () {
    $response = get(route('assets.show', 999));
    $response->assertStatus(404);
});

test('user can store a new asset with minimum data', function () {
    $data = ['title' => 'New Server'];
    
    $response = post(route('assets.store'), $data);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('assets.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('assets', ['title' => 'New Server', 'parent_id' => null]);
});

test('user can store a new asset with parent and icon', function () {
    $parent = Asset::factory()->create();
    $data = [
        'title' => 'Child Asset',
        'parent_id' => $parent->id,
        'icon' => 'server',
        'description' => 'A complex description',
    ];
    
    post(route('assets.store'), $data)
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('assets', [
        'title' => 'Child Asset',
        'parent_id' => $parent->id,
        'icon' => 'server',
    ]);
});

test('user can store a new asset with attributes', function () {
    $attributes = [
        ['key' => 'SN', 'value' => 'XYZ123'],
        ['key' => 'Location', 'value' => 'Rack A'],
    ];

    $data = ['title' => 'Asset with Attributes', 'attributes' => $attributes];
    
    post(route('assets.store'), $data)
        ->assertSessionHasNoErrors();

    $asset = Asset::where('title', 'Asset with Attributes')->first();

    $this->assertDatabaseCount('asset_attributes', 2);
    $this->assertDatabaseHas('asset_attributes', [
        'asset_id' => $asset->id,
        'key' => 'SN',
        'value' => 'XYZ123',
    ]);
});

test('user can store a new asset with attachments', function () {
    $file = UploadedFile::fake()->image('test-image.jpg', 100, 100);

    $attachments = [[
        'title' => 'Manual',
        'description' => 'User manual PDF',
        'file' => $file,
    ]];

    $data = ['title' => 'Asset with Attachments', 'attachments' => $attachments];

    post(route('assets.store'), $data)
        ->assertSessionHasNoErrors();

    $asset = Asset::where('title', 'Asset with Attachments')->first();
    $attachment = Attachment::first();

    $this->assertDatabaseCount('attachments', 1);
    
    $this->assertDatabaseHas('asset_attachments', [
        'asset_id' => $asset->id,
        'attachment_id' => $attachment->id,
    ]);

    Storage::disk('public')->assertExists($attachment->file_path);
});

test('user can update asset title', function () {
    $asset = Asset::factory()->create(['title' => 'Old Title']);

    $data = [
        'title' => 'Updated Title',
        'attributes' => [],
        'attachments' => [],
    ];
    
    $response = post(route('assets.update', $asset), $data); 

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('assets.show', $asset))
        ->assertSessionHas('success');

    $this->assertDatabaseHas('assets', ['id' => $asset->id, 'title' => 'Updated Title']);
});

test('user can update parent association', function () {
    $parent1 = Asset::factory()->create();
    $parent2 = Asset::factory()->create();
    $asset = Asset::factory()->create(['parent_id' => $parent1->id]);

    $baseData = ['title' => $asset->title, 'attributes' => [], 'attachments' => []];

    post(route('assets.update', $asset), array_merge($baseData, ['parent_id' => $parent2->id]))
        ->assertSessionHasNoErrors();
    $this->assertDatabaseHas('assets', ['id' => $asset->id, 'parent_id' => $parent2->id]);

    post(route('assets.update', $asset), array_merge($baseData, ['parent_id' => null]))
        ->assertSessionHasNoErrors();
    $this->assertDatabaseHas('assets', ['id' => $asset->id, 'parent_id' => null]);
});

test('user can update and replace all attributes', function () {
    $asset = Asset::factory()->create();
    $asset->attributes()->createMany([
        ['key' => 'Old Key 1', 'value' => 'Old Value 1'],
        ['key' => 'Old Key 2', 'value' => 'Old Value 2'],
    ]);
    
    $newAttributes = [
        ['key' => 'NEW_SN', 'value' => '456'],
    ];

    $asset->refresh();
    $initialAttributes = $asset->attributes; 

    $data = [
        'title' => $asset->title, 
        'attributes' => $newAttributes,
        'attachments' => [], 
    ];

    post(route('assets.update', $asset), $data)
        ->assertSessionHasNoErrors();

    $this->assertDatabaseCount('asset_attributes', 1);
    $this->assertDatabaseHas('asset_attributes', ['asset_id' => $asset->id, 'key' => 'NEW_SN']);
    
    $initialAttributes->each(function ($attribute) use ($asset) {
        $this->assertDatabaseMissing('asset_attributes', ['asset_id' => $asset->id, 'key' => $attribute->key]);
    });
});

test('user can soft delete an asset', function () {
    $asset = Asset::factory()->create();
    
    $response = delete(route('assets.destroy', $asset));
    
    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('assets.index'))
        ->assertSessionHas('success');

    $this->assertSoftDeleted('assets', ['id' => $asset->id]);
});

test('user can restore a soft deleted asset', function () {
    $asset = Asset::factory()->trashed()->create();
    
    $response = post(route('assets.restore', $asset));
    
    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('assets.index'))
        ->assertSessionHas('success');

    $this->assertNotSoftDeleted('assets', ['id' => $asset->id]);
});

test('user can force delete an asset', function () {
    $asset = Asset::factory()->trashed()->create();
    
    $response = delete(route('assets.force_delete', $asset));
    
    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('assets.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('assets', ['id' => $asset->id]);
});