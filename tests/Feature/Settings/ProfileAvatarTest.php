<?php
// php
namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\User;
use App\Models\Attachment;

/**
 * Class ProfileAvatarTest
 *
 * Tests for user avatar upload and removal in profile settings.
 */
class ProfileAvatarTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that a user can upload an avatar, and it is stored and saved in the database.
     */
    public function test_user_can_upload_avatar_and_it_is_stored_and_saved_in_db()
    {
        Storage::fake('public');

        $user = User::factory()->create();
        $this->actingAs($user);

        $file = UploadedFile::fake()->create('avatar.jpg', 500, 'image/jpeg'); // 500 KB

        $response = $this->patch(route('settings.profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => $file,
            'phone' => null,
        ]);

        $response->assertRedirect(route('settings.profile.edit'));
        $response->assertSessionHas('success');

        $this->assertDatabaseCount('attachments', 1);
        $attachment = Attachment::first();

        Storage::disk('public')->assertExists($attachment->file_path);

        $user->refresh();
        $this->assertEquals($attachment->id, $user->attachment_avatar);
    }

    /**
     * Test that a user can remove their avatar and the file is deleted from storage.
     */
    public function test_user_can_remove_avatar_and_file_is_deleted()
    {
        Storage::fake('public');

        $user = User::factory()->create();

        $file = UploadedFile::fake()->create('avatar.jpg', 200, 'image/jpeg'); // 200 KB
        $path = $file->store("users/{$user->id}/avatars", 'public');

        $attachment = Attachment::create([
            'title' => 'Test avatar',
            'description' => 'desc',
            'file_name' => $file->getClientOriginalName(),
            'file_path' => str_replace('public/', '', $path),
            'mime_type' => $file->getMimeType(),
            'file_extension' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
        ]);

        $user->update(['attachment_avatar' => $attachment->id]);

        $this->actingAs($user);

        $response = $this->patch(route('settings.profile.update'), [
            'name' => $user->name,
            'email' => $user->email,
            'avatar' => null,
            'phone' => null,
        ]);

        $response->assertRedirect(route('settings.profile.edit'));
        $response->assertSessionHas('success');

        $this->assertDatabaseCount('attachments', 0);
        Storage::disk('public')->assertMissing($attachment->file_path);

        $user->refresh();
        $this->assertNull($user->attachment_avatar);
    }
}
