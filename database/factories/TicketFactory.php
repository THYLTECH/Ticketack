<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketFactory extends Factory
{
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'description' => $this->faker->paragraph(),
            'author_id' => User::factory(),
            'asset_id' => Asset::factory(),
            'priority_id' => TicketPriority::inRandomOrder()->first()?->id ?? TicketPriority::factory(),
            'status_id' => TicketStatus::inRandomOrder()->first()?->id ?? TicketStatus::factory(),
            'category_id' => TicketCategory::inRandomOrder()->first()?->id ?? TicketCategory::factory(),
            'archived_at' => null,
        ];
    }

    public function archived(): static
    {
        return $this->state(fn () => [
            'archived_at' => now()->subDays(rand(1, 30)),
        ]);
    }

    public function withContext(string $icon): static
    {
        $scenarios = __("factory_tickets.scenarios.$icon");

        if (!is_array($scenarios)) {
            $scenarios = __("factory_tickets.generic");
        }

        $selected = $this->faker->randomElement($scenarios);

        return $this->state(fn () => [
            'title' => $selected['title'],
            'description' => $selected['description'],
        ]);
    }
}
