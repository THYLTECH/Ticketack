<?php

namespace Database\Factories;

use App\Models\NotificationPreference;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationPreferenceFactory extends Factory
{
    protected $model = NotificationPreference::class;

    public function definition(): array
    {
        $categories = ['auth'];
        $types = ['password_reset', 'verify_email'];
        $channels = ['mail', 'database', 'vonage'];

        return [
            'user_id'  => User::factory(),
            'category' => $this->faker->randomElement($categories),
            'type'     => $this->faker->randomElement($types),
            'channel'  => $this->faker->randomElement($channels),
            'enabled'  => $this->faker->boolean(),
        ];
    }

    /**
     * Force une catégorie, un type ou un channel précis
     */
    public function category(string $category): static
    {
        return $this->state(fn () => ['category' => $category]);
    }

    public function type(string $type): static
    {
        return $this->state(fn () => ['type' => $type]);
    }

    public function channel(string $channel): static
    {
        return $this->state(fn () => ['channel' => $channel]);
    }

    public function enabled(bool $enabled = true): static
    {
        return $this->state(fn () => ['enabled' => $enabled]);
    }
}
