<?php

use App\Models\User;
use App\Models\DatabaseNotification;
use function Pest\Laravel\{actingAs, get, put, delete};

beforeEach(function () {
    $this->user = User::factory()->create();

    $this->n1 = DatabaseNotification::factory()->create([
        'notifiable_id' => $this->user->id,
        'data' => [
            'title' => 'Welcome',
            'message' => 'Welcome message',
            'type' => 'password_reset',
            'category' => 'auth',
        ],
    ]);

    $this->n2 = DatabaseNotification::factory()->create([
        'notifiable_id' => $this->user->id,
        'data' => [
            'title' => 'Alert',
            'message' => 'Security alert',
            'type' => 'verify_email',
            'category' => 'auth',
        ],
    ]);

    $this->n3 = DatabaseNotification::factory()->create([
        'notifiable_id' => $this->user->id,
        'data' => [
            'title' => 'News',
            'message' => 'Something happened',
            'type' => 'password_reset',
            'category' => 'auth',
        ],
    ]);
});


test('notifications index page loads', function () {
    actingAs($this->user);

    $response = get(route('notifications.index'));

    $response->assertOk();
});


test('search filters notifications by message, title or type', function () {
    actingAs($this->user);

    $response = get(route('notifications.index', ['search' => 'alert']));

    $response->assertOk();

    // expect(count($data))->toBe(1);
    // expect($data[0]['id'])->toBe($this->n2->id);
});


test('user can mark a single notification as read', function () {
    actingAs($this->user);

    $response = put(route('notifications.markAsRead', $this->n1->id));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->n1->refresh();

    expect($this->n1->read_at)->not->toBeNull();
});


test('user cannot mark a notification of another user as read', function () {
    $other = User::factory()->create();

    $foreign = DatabaseNotification::factory()->create([
        'notifiable_id' => $other->id,
        'data' => ['title' => 'X', 'message' => 'Y', 'type' => 'A', 'category' => 'auth'],
    ]);

    actingAs($this->user);

    $response = put(route('notifications.markAsRead', $foreign->id));

    $response->assertStatus(403);

    $foreign->refresh();
    expect($foreign->read_at)->toBeNull();
});


test('user can mark many notifications as read', function () {
    actingAs($this->user);

    $ids = [$this->n1->id, $this->n2->id];

    $response = put(route('notifications.markManyAsRead', ['ids' => $ids]));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    $this->n1->refresh();
    $this->n2->refresh();

    expect($this->n1->read_at)->not->toBeNull();
    expect($this->n2->read_at)->not->toBeNull();
});


test('user can delete a notification', function () {
    actingAs($this->user);

    $response = delete(route('notifications.destroy', $this->n1->id));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(DatabaseNotification::find($this->n1->id))->toBeNull();
});


test('user cannot delete notification of another user', function () {
    $other = User::factory()->create();

    $foreign = DatabaseNotification::factory()->create([
        'notifiable_id' => $other->id,
        'data' => ['title' => 'Hello', 'message' => 'World', 'type' => 'x', 'category' => 'auth'],
    ]);

    actingAs($this->user);

    $response = delete(route('notifications.destroy', $foreign->id));

    $response->assertStatus(403);

    expect(DatabaseNotification::find($foreign->id))->not->toBeNull();
});


test('user can delete many notifications', function () {
    actingAs($this->user);

    $ids = [$this->n2->id, $this->n3->id];

    $response = delete(route('notifications.destroyMany', ['ids' => $ids]));

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(DatabaseNotification::find($this->n2->id))->toBeNull();
    expect(DatabaseNotification::find($this->n3->id))->toBeNull();
});
