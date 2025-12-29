<?php

namespace Database\Factories;

use App\Models\TicketCategory;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketCategory>
 */
class TicketCategoryFactory extends Factory
{
    protected $model = TicketCategory::class;

    public function definition()
    {
        return [
            'title' => $this->faker->word(),
            'sort_order' => $this->faker->numberBetween(1, 100),
            'color' => $this->faker->hexColor(),
        ];
    }
}
