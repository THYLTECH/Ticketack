<?php

namespace Tests\Feature;

use App\Models\Attachment;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use function Pest\Laravel\{actingAs, delete};

uses(RefreshDatabase::class);

beforeEach(function () {
    $role = Role::create(['name' => 'admin']);

    $this->user = User::factory()->create();
    $this->user->assignRole($role);

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


test('attachment deletion handles missing physical file gracefully', function () {
    $attachment = Attachment::create([
        'title' => 'missing.png',
        'file_name' => 'missing.png',
        'file_path' => 'tickets/1/attachments/missing.png',
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    Storage::disk('public')->assertMissing($attachment->file_path);

    delete(route('attachments.destroy', $attachment))
        ->assertRedirect();

    $this->assertDatabaseMissing('attachments', ['id' => $attachment->id]);
});

test('attachment url is generated correctly', function () {
    $file = UploadedFile::fake()->image('url-test.png');
    $path = $file->store('tickets/1/attachments', 'public');

    $attachment = Attachment::create([
        'title' => 'url-test.png',
        'file_name' => 'url-test.png',
        'file_path' => $path,
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    expect($attachment->url)->toContain('/storage/')
        ->and($attachment->url)->toContain($path);
});

test('attachment with empty file path returns empty url', function () {
    $attachment = Attachment::create([
        'title' => 'no-file.png',
        'file_name' => 'no-file.png',
        'file_path' => '',
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 0,
    ]);

    expect($attachment->url)->toBe('');
});


test('attachment deletion creates ticket log when associated with comment', function () {
    $ticket = Ticket::factory()->create();
    $comment = TicketComment::factory()->create([
        'ticket_id' => $ticket->id,
    ]);

    $file = UploadedFile::fake()->image('log-test.png');
    $path = $file->store('tickets/1/attachments', 'public');

    $attachment = Attachment::create([
        'title' => 'log-test.png',
        'file_name' => 'log-test.png',
        'file_path' => $path,
        'mime_type' => 'image/png',
        'file_extension' => 'png',
        'file_size' => 1024,
    ]);

    // Attacher la relation AVANT de supprimer
    $attachment->comments()->attach($comment->id);

    // Rafraîchir pour s'assurer que la relation est chargée
    $attachment->refresh();

    delete(route('attachments.destroy', $attachment));

    $this->assertDatabaseHas('ticket_logs', [
        'ticket_id' => $ticket->id,
        'action' => 'attachment_deleted',
        'old_value' => 'log-test.png',
    ]);
});

