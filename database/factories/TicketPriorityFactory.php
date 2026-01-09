<?php

namespace Database\Factories;

use App\Models\TicketPriority;
use Illuminate\Database\Eloquent\Factories\Factory;

class TicketPriorityFactory extends Factory
{
    protected $model = TicketPriority::class;

    public function definition(): array
    {
        return [
            'title' => fake()->word(),
            'color' => fake()->hexColor(),
            'sort_order' => TicketPriority::max('sort_order') + 1 ?? 1,
        ];
    }

}
