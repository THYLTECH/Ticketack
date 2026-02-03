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
            'sort_order' => TicketCategory::max('sort_order') + 1 ?? 1,
            'color' => $this->faker->hexColor(),
        ];
    }
}
