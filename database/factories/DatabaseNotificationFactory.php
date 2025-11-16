<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Notifications\DatabaseNotification;
use App\Models\User;
use Illuminate\Support\Str;

class DatabaseNotificationFactory extends Factory
{
    protected $model = DatabaseNotification::class;

    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'type' => 'App\\Notifications\\GenericTestNotification',
            'notifiable_type' => User::class,
            'notifiable_id' => User::factory(),
            'data' => [
                'title' => $this->faker->sentence(),
                'message' => $this->faker->sentence(),
                'type' => 'test_notification',
                'category' => 'test',
            ],
            'read_at' => null,
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    public function read(): static
    {
        return $this->state(fn () => [
            'read_at' => now(),
        ]);
    }

    public function forUser(User $user): static
    {
        return $this->state(fn () => [
            'notifiable_id' => $user->id,
        ]);
    }

    public function withType(string $type, string $category = 'auth'): static
    {
        return $this->state(fn () => [
            'data' => [
                'title' => ucfirst(str_replace('_', ' ', $type)),
                'message' => 'Test message',
                'type' => $type,
                'category' => $category,
            ],
        ]);
    }
}
