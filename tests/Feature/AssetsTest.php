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
use function Pest\Laravel\{actingAs, delete, get, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    Permission::create(['name' => 'view assets']);
    Permission::create(['name' => 'show assets']);
    Permission::create(['name' => 'create assets']);
    Permission::create(['name' => 'update assets']);
    Permission::create(['name' => 'delete assets']);
    Permission::create(['name' => 'view trash']);
    Permission::create(['name' => 'restore items']);
    Permission::create(['name' => 'force delete items']);

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
        ->assertInertia(fn ($page) => $page->component('assets/index')
            ->has('assets.data', 3)
        );
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

    $oldAttributes = $asset->attributes()->get();

    $newAttributes = [
        ['key' => 'NEW_SN', 'value' => '456'],
    ];

    $data = [
        'title' => $asset->title,
        'attributes' => $newAttributes,
        'attachments' => [],
    ];

    post(route('assets.update', $asset), $data)
        ->assertSessionHasNoErrors();

    $this->assertDatabaseHas('asset_attributes', [
        'asset_id' => $asset->id,
        'key' => 'NEW_SN'
    ]);

    foreach ($oldAttributes as $attribute) {
        $this->assertDatabaseMissing('asset_attributes', [
            'asset_id' => $asset->id,
            'key' => $attribute->key
        ]);
    }

    $this->assertDatabaseCount('asset_attributes', 1);
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
    $asset = Asset::factory()->create();
    $asset->delete();

    $response = put(route('trash.restore', ['type' => 'asset', 'id' => $asset->id]));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertNotSoftDeleted('assets', ['id' => $asset->id]);
});

test('user can force delete an asset', function () {
    $asset = Asset::factory()->create();
    $asset->delete();

    $response = delete(route('trash.force-delete', ['type' => 'asset', 'id' => $asset->id]));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->assertDatabaseMissing('assets', ['id' => $asset->id]);
});


test('user cannot set parent to self or descendant', function () {
    $asset = Asset::factory()->create();

    $data = [
        'title' => $asset->title,
        'parent_id' => $asset->id,
    ];

    $response = $this->from(route('assets.edit', $asset))
        ->post(route('assets.update', $asset), $data);

    $response->assertRedirect(route('assets.edit', $asset));
    $response->assertSessionHasErrors(['parent_id']);

    $this->assertDatabaseHas('assets', ['id' => $asset->id, 'parent_id' => null]);

    $child = Asset::factory()->create(['parent_id' => $asset->id]);

    $dataChild = [
        'title' => $asset->title,
        'parent_id' => $child->id,
    ];

    $responseChild = $this->from(route('assets.edit', $asset))
        ->post(route('assets.update', $asset), $dataChild);

    $responseChild->assertRedirect(route('assets.edit', $asset));
    $responseChild->assertSessionHas('error');

    $this->assertDatabaseHas('assets', ['id' => $asset->id, 'parent_id' => null]);
});
test('removing an attachment from the list deletes the file from storage', function () {
    Storage::fake('public');

    $asset = Asset::factory()->create();
    $file = UploadedFile::fake()->image('delete_me.jpg');

    post(route('assets.store'), [
        'title' => 'Asset to Update',
        'attachments' => [[
            'title' => 'Doc',
            'file' => $file
        ]]
    ]);

    $asset = Asset::where('title', 'Asset to Update')->first();
    $attachment = $asset->attachments()->first();

    Storage::disk('public')->assertExists($attachment->file_path);

    post(route('assets.update', $asset), [
        'title' => 'Updated Asset',
        'attachments' => []
    ]);

    $this->assertDatabaseMissing('attachments', ['id' => $attachment->id]);

    Storage::disk('public')->assertMissing($attachment->file_path);
});

test('updating an asset with invalid attachment data triggers validation error', function () {
    $asset = Asset::factory()->create();

    $data = [
        'title' => 'Invalid File',
        'attachments' => [[
            'title' => 'Bad Data',
            'file' => 'not-a-file-and-not-an-array'
        ]]
    ];

    $response = post(route('assets.update', $asset), $data);
    $response->assertSessionHasErrors(['attachments.0.file']);
});

test('updating an asset validates file max size', function () {
    config(['filesystems.upload_max_size' => 100]); // 100 KB

    $asset = Asset::factory()->create();

    $largeFile = UploadedFile::fake()->create('large.pdf', 200);

    $data = [
        'title' => 'Large File Asset',
        'attachments' => [[
            'title' => 'Large Doc',
            'file' => $largeFile
        ]]
    ];

    $response = post(route('assets.update', $asset), $data);

    $response->assertSessionHasErrors(['attachments.0.file']);
});

test('user can update existing attachment metadata without re-uploading', function () {
    $asset = Asset::factory()->create();
    $attachment = Attachment::factory()->create();
    $asset->attachments()->save($attachment);

    $data = [
        'title' => $asset->title,
        'attachments' => [[
            'id' => (string) $attachment->id,
            'title' => 'New Attachment Title',
            'description' => 'New Description',
            'file' => null
        ]]
    ];

    $response = post(route('assets.update', $asset), $data);
    $response->assertSessionHasNoErrors();

    $this->assertDatabaseHas('attachments', [
        'id' => $attachment->id,
        'title' => 'New Attachment Title',
        'description' => 'New Description'
    ]);
});
