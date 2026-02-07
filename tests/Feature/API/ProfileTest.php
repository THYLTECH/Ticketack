<?php

use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use function Pest\Laravel\withHeaders;

beforeEach(function () {
    $this->user = User::factory()->create();
    $this->token = $this->user->createToken('test')->plainTextToken;
    $this->headers = ['Authorization' => 'Bearer ' . $this->token];
});

test('can retrieve own profile via api', function () {
    withHeaders($this->headers)
        ->get('/api/me')
        ->assertStatus(200)
        ->assertJson(['id' => $this->user->id, 'email' => $this->user->email]);
});

test('can update profile info', function () {
    withHeaders($this->headers)
        ->patchJson('/api/me/profile', [
            'name' => 'New Name API',
            'phone' => '0699999999'
        ])
        ->assertStatus(200)
        ->assertJsonPath('user.name', 'New Name API');

    $this->assertDatabaseHas('users', ['id' => $this->user->id, 'name' => 'New Name API']);
});

test('can update password', function () {
    withHeaders($this->headers)
        ->putJson('/api/me/password', [
            'current_password' => 'password', // Default factory password
            'password' => 'newpassword123',
            'password_confirmation' => 'newpassword123',
        ])
        ->assertStatus(200);
});

test('can upload avatar', function () {
    Storage::fake('public');
    $file = UploadedFile::fake()->image('avatar.jpg');

    withHeaders($this->headers)
        ->post('/api/me/avatar', [
            'avatar' => $file,
        ])
        ->assertStatus(200);

    $this->user->refresh();
    $this->assertNotNull($this->user->attachment_avatar);
    Storage::disk('public')->assertExists($this->user->avatar->file_path);
});
