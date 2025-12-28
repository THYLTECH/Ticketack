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

            // CORRECTION ICI : 'author_id' au lieu de 'user_id'
            'author_id' => User::factory(),

            'asset_id' => Asset::factory(),

            'priority_id' => TicketPriority::first()?->id ?? TicketPriority::create([
                    'title' => 'Medium', 'color' => '#000000', 'sort_order' => 1
                ])->id,

            'status_id' => TicketStatus::first()?->id ?? TicketStatus::create([
                    'title' => 'Open', 'color' => '#000000', 'sort_order' => 1, 'is_default' => true
                ])->id,

            'category_id' => TicketCategory::first()?->id ?? TicketCategory::create([
                    'title' => 'General', 'color' => '#000000', 'sort_order' => 1
                ])->id,
        ];
    }
}
