<?php

namespace Database\Factories;

use App\Models\TicketStatus;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketStatusFactory extends Factory
{
    protected $model = TicketStatus::class;

    public function definition(): array
    {
        return [
            'title' => $this->faker->unique()->word(),
            'color' => $this->faker->hexColor(),
            'sort_order' => $this->faker->numberBetween(0, 100),
            'is_default' => false,
        ];
    }
}
