<?php

namespace Tests\Feature;

use App\Models\Attachment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use function Pest\Laravel\{actingAs, delete};

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->user = User::factory()->create();
    actingAs($this->user);
    Storage::fake('public');
});

test('it can delete an attachment and its physical file', function () {
    $file = UploadedFile::fake()->image('test.png');
    $path = $file->store('tickets/1/attachments', 'public');

    $attachment = Attachment::create([
        'title' => 'test.png',
        'file_name' => 'test.png',
        'file_path' => $path,
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    Storage::disk('public')->assertExists($path);

    delete(route('attachments.destroy', $attachment))
        ->assertRedirect();

    $this->assertDatabaseMissing('attachments', ['id' => $attachment->id]);
    Storage::disk('public')->assertMissing($path);
});
