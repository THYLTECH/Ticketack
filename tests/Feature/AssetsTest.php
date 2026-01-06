<?php

namespace Tests\Feature;

use App\Models\Asset;
use App\Models\AssetAttribute;
use App\Models\Attachment;
use App\Models\AssetAttachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete, get, post, put};

uses(RefreshDatabase::class);

beforeEach(function () {
    $role = Role::firstOrCreate(['name' => 'admin']);

    $this->user = User::factory()->create();
    $this->user->assignRole($role);

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

test('force deleting an asset deletes its attachments from storage', function () {
    Storage::fake('public');

    $asset = Asset::factory()->create();

    $file = UploadedFile::fake()->create('doc.pdf', 100);
    $path = Storage::disk('public')->putFile("assets/{$asset->id}/attachments", $file);

    $attachment = Attachment::create([
        'file_name' => 'doc.pdf',
        'file_path' => $path,
        'mime_type' => 'application/pdf',
        'file_extension' => 'pdf',
        'file_size' => 1024,
        'title' => 'Doc',
    ]);
    $asset->attachments()->save($attachment);

    $asset->delete();

    $response = delete(route('assets.force_delete', $asset));

    $response
        ->assertRedirect(route('assets.index'))
        ->assertSessionHas('success');

    $this->assertDatabaseMissing('assets', ['id' => $asset->id]);
    $this->assertDatabaseMissing('attachments', ['id' => $attachment->id]);
    Storage::disk('public')->assertMissing($path);
});

test('asset index page passes search filters to frontend', function () {
    $searchTerm = 'server';
    $response = get(route('assets.index', ['search' => $searchTerm]));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('assets/index')
            ->where('filters.search', $searchTerm)
        );
});

test('asset index page filters assets by title', function () {
    Asset::factory()->create(['title' => 'Server 1 - Ubuntu']);
    Asset::factory()->create(['title' => 'Database Backup']);

    $response = get(route('assets.index', ['search' => 'server']));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('assets.data', 1)
            ->where('assets.data.0.title', 'Server 1 - Ubuntu')
        );
});

test('asset index page returns depth_level for hierarchy visualization', function () {
    $parent = Asset::factory()->create(['title' => 'Parent']);

    $child = Asset::factory()->create(['title' => 'Child', 'parent_id' => $parent->id]);

    $response = get(route('assets.index', ['limit' => 20]));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('assets.data.0.id', $parent->id)
            ->where('assets.data.0.depth_level', 0)
            ->where('assets.data.1.id', $child->id)
            ->where('assets.data.1.depth_level', 1)
        );
});

test('asset index page does not fail when a parent is soft-deleted', function () {
    $parent = Asset::factory()->create(['title' => 'parent to be deleted']);
    $parent->delete();
    $child = Asset::factory()->create(['title' => 'Child', 'parent_id' => $parent->id]);

    $response = get(route('assets.index'));

    $response
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('assets.data', 1)
            ->where('assets.data.0.title', 'Child')
            ->where('assets.data.0.depth_level', 1)
        );
});




test('asset index page applies sorting parameters', function () {
    Asset::factory()->create(['title' => 'Alpha Asset']);
    Asset::factory()->create(['title' => 'Beta Asset']);

    get(route('assets.index', ['sort' => 'title', 'direction' => 'desc']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('assets.data.0.title', 'Beta Asset')
        );
});

test('asset index page filters by description', function () {
    Asset::factory()->create(['description' => 'Contains special keyword']);
    Asset::factory()->create(['description' => 'Normal description']);

    get(route('assets.index', ['search' => 'special keyword']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('assets.data', 1));
});

test('asset create page returns attribute keys sorted by usage count', function () {
    AssetAttribute::query()->delete();

    $asset1 = Asset::factory()->create();
    $asset2 = Asset::factory()->create();

    AssetAttribute::factory()->create(['asset_id' => $asset1->id, 'key' => 'CommonKey']);
    AssetAttribute::factory()->create(['asset_id' => $asset2->id, 'key' => 'CommonKey']);
    AssetAttribute::factory()->create(['asset_id' => $asset1->id, 'key' => 'RareKey']);

    get(route('assets.create'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->where('attribute_keys.0', 'CommonKey')
        );
});


test('user can store asset with all optional fields', function () {
    $parent = Asset::factory()->create();

    post(route('assets.store'), [
        'title' => 'Complete Asset',
        'description' => 'Full description',
        'icon' => 'server',
        'parent_id' => $parent->id,
        'attributes' => [
            ['key' => 'SN', 'value' => '12345']
        ],
    ])->assertRedirect();

    $this->assertDatabaseHas('assets', [
        'title' => 'Complete Asset',
        'description' => 'Full description',
        'icon' => 'server',
        'parent_id' => $parent->id,
    ]);
});

test('store validates title is required', function () {
    post(route('assets.store'), [
        'title' => '',
    ])->assertSessionHasErrors(['title']);
});

test('store validates parent_id exists', function () {
    post(route('assets.store'), [
        'title' => 'Test Asset',
        'parent_id' => 99999,
    ])->assertSessionHasErrors(['parent_id']);
});

test('store validates attributes structure', function () {
    post(route('assets.store'), [
        'title' => 'Test Asset',
        'attributes' => [
            ['key' => 'Key1', 'value' => ''],
        ],
    ])->assertSessionHasErrors(['attributes.0.value']);
});

test('store validates duplicate attribute keys', function () {
    post(route('assets.store'), [
        'title' => 'Test Asset',
        'attributes' => [
            ['key' => 'SameKey', 'value' => 'Value1'],
            ['key' => 'SameKey', 'value' => 'Value2'],
        ],
    ])->assertSessionHasErrors(['attributes.0.key']);
});

test('store validates attachments max count', function () {
    $files = collect(range(1, 11))->map(fn() => UploadedFile::fake()->image('file.jpg'));

    post(route('assets.store'), [
        'title' => 'Too many files',
        'attachments' => $files->map(fn($file) => [
            'title' => 'File',
            'file' => $file
        ])->toArray()
    ])->assertSessionHasErrors(['attachments']);
});

test('store validates attachment file is required', function () {
    post(route('assets.store'), [
        'title' => 'Asset',
        'attachments' => [
            ['title' => 'Doc without file']
        ]
    ])->assertSessionHasErrors(['attachments.0.file']);
});

test('store validates attachment mime types', function () {
    $file = UploadedFile::fake()->create('document.exe', 100);

    post(route('assets.store'), [
        'title' => 'Asset',
        'attachments' => [[
            'title' => 'Invalid file',
            'file' => $file
        ]]
    ])->assertSessionHasErrors(['attachments.0.file']);
});

test('update validates parent cannot be self', function () {
    $asset = Asset::factory()->create();

    post(route('assets.update', $asset), [
        'title' => 'Updated',
        'parent_id' => $asset->id,
        'attributes' => [],
        'attachments' => []
    ])->assertSessionHasErrors(['parent_id']);
});

test('update handles grandchild parent assignment prevention', function () {
    $grandparent = Asset::factory()->create();
    $parent = Asset::factory()->create(['parent_id' => $grandparent->id]);
    $child = Asset::factory()->create(['parent_id' => $parent->id]);

    post(route('assets.update', $grandparent), [
        'title' => 'Updated',
        'parent_id' => $child->id,
        'attributes' => [],
        'attachments' => []
    ])->assertRedirect(route('assets.edit', $grandparent))
        ->assertSessionHas('error');

    $this->assertDatabaseHas('assets', [
        'id' => $grandparent->id,
        'parent_id' => null
    ]);
});

test('update removes parent when parent_id is null', function () {
    $parent = Asset::factory()->create();
    $asset = Asset::factory()->create(['parent_id' => $parent->id]);

    post(route('assets.update', $asset), [
        'title' => 'Updated',
        'parent_id' => null,
        'attributes' => [],
        'attachments' => []
    ])->assertRedirect();

    $this->assertDatabaseHas('assets', [
        'id' => $asset->id,
        'parent_id' => null
    ]);
});

test('update adds new attachment while keeping existing ones', function () {
    $asset = Asset::factory()->create();
    $existingAttachment = Attachment::factory()->create();
    $asset->attachments()->save($existingAttachment);

    $newFile = UploadedFile::fake()->image('new.jpg');

    post(route('assets.update', $asset), [
        'title' => 'Updated',
        'attributes' => [],
        'attachments' => [
            [
                'id' => (string) $existingAttachment->id,
                'title' => $existingAttachment->title,
                'file' => null
            ],
            [
                'title' => 'New Attachment',
                'file' => $newFile
            ]
        ]
    ])->assertRedirect();

    $this->assertDatabaseCount('attachments', 2);
    $this->assertDatabaseHas('asset_attachments', [
        'asset_id' => $asset->id,
        'attachment_id' => $existingAttachment->id
    ]);
});

test('update validates attachment metadata without file upload', function () {
    $asset = Asset::factory()->create();
    $attachment = Attachment::factory()->create();
    $asset->attachments()->save($attachment);

    post(route('assets.update', $asset), [
        'title' => 'Updated',
        'attributes' => [],
        'attachments' => [[
            'id' => (string) $attachment->id,
            'title' => '',
            'file' => null
        ]]
    ])->assertSessionHasErrors(['attachments.0.title']);
});

test('update enforces 10 attachments limit with existing files', function () {
    $asset = Asset::factory()->create();

    foreach(range(1, 10) as $i) {
        $attachment = Attachment::factory()->create();
        $asset->attachments()->save($attachment);
    }

    $newFile = UploadedFile::fake()->image('extra.jpg');

    post(route('assets.update', $asset), [
        'title' => 'Updated',
        'attributes' => [],
        'attachments' => [[
            'title' => 'Extra File',
            'file' => $newFile
        ]]
    ])->assertSessionHasErrors(['attachments']);
});

test('user without view permission cannot access index', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('assets.index'))
        ->assertForbidden();
});

test('user without create permission cannot access create page', function () {
    $user = User::factory()->create();

    actingAs($user)
        ->get(route('assets.create'))
        ->assertForbidden();
});

test('user without update permission cannot update asset', function () {
    $user = User::factory()->create();
    $asset = Asset::factory()->create();

    actingAs($user)
        ->post(route('assets.update', $asset), ['title' => 'Test'])
        ->assertForbidden();
});

test('user without delete permission cannot delete asset', function () {
    $user = User::factory()->create();
    $asset = Asset::factory()->create();

    actingAs($user)
        ->delete(route('assets.destroy', $asset))
        ->assertForbidden();
});

test('restore returns success message', function () {
    $asset = Asset::factory()->create();
    $asset->delete();

    put(route('trash.restore', ['type' => 'asset', 'id' => $asset->id]))
        ->assertSessionHas('success');
});

test('force delete removes all associated attributes', function () {
    $asset = Asset::factory()->create();
    $asset->attributes()->create(['key' => 'Test', 'value' => 'Value']);
    $asset->delete();

    delete(route('trash.force-delete', ['type' => 'asset', 'id' => $asset->id]));

    $this->assertDatabaseMissing('asset_attributes', ['asset_id' => $asset->id]);
});

test('asset show page loads with attachments', function () {
    $asset = Asset::factory()->create();
    $attachment = Attachment::factory()->create();
    $asset->attachments()->save($attachment);

    get(route('assets.show', $asset))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('asset.attachments', 1)
        );
});

test('asset edit page excludes current asset from parent options', function () {
    $asset = Asset::factory()->create();
    Asset::factory()->count(2)->create();

    get(route('assets.edit', $asset))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->has('assets', 2)
        );
});

test('index page handles empty search results', function () {
    Asset::factory()->create(['title' => 'Existing Asset']);

    get(route('assets.index', ['search' => 'NonExistentSearchTerm']))
        ->assertOk()
        ->assertInertia(fn ($page) => $page->has('assets.data', 0));
});

test('store creates attachment with correct metadata', function () {
    $file = UploadedFile::fake()->image('test.jpg', 100, 100);

    post(route('assets.store'), [
        'title' => 'Asset with Metadata',
        'attachments' => [[
            'title' => 'Custom Title',
            'description' => 'Custom Description',
            'file' => $file
        ]]
    ])->assertRedirect();

    $this->assertDatabaseHas('attachments', [
        'title' => 'Custom Title',
        'description' => 'Custom Description',
        'file_name' => 'test.jpg',
        'mime_type' => 'image/jpeg'
    ]);
});

test('update deletes orphaned attachments from pivot table', function () {
    $asset = Asset::factory()->create();
    $attachment = Attachment::factory()->create();
    $asset->attachments()->save($attachment);

    post(route('assets.update', $asset), [
        'title' => 'Updated',
        'attributes' => [],
        'attachments' => []
    ])->assertRedirect();

    $this->assertDatabaseMissing('asset_attachments', [
        'asset_id' => $asset->id,
        'attachment_id' => $attachment->id
    ]);
});

