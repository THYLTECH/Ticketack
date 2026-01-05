<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketAssignee;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<TicketAssignee>
 */
class TicketAssigneeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TicketAssignee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ticket_id' => Ticket::factory(),
            'user_id' => User::factory(),
            'role_title' => $this->faker->jobTitle(),
            'role_description' => $this->faker->sentence(),
        ];
    }
}
