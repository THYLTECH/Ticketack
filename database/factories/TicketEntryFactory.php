<?php

namespace Database\Factories;

use App\Models\Ticket;
use App\Models\TicketEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TicketEntry>
 */
class TicketEntryFactory extends Factory
{
    protected $model = TicketEntry::class;

    public function definition(): array
    {
        $start = $this->faker->dateTimeBetween('-1 month', 'now');
        // Durée entre 5 min (300s) et 4h (14400s)
        $duration = $this->faker->numberBetween(300, 14400);
        $end = (clone $start)->modify("+{$duration} seconds");

        return [
            'ticket_id' => Ticket::factory(),
            'user_id' => User::factory(),
            'note' => $this->faker->sentence(),
            'start_at' => $start,
            'end_at' => $end,
            'duration_seconds' => $duration,
            'billable' => $this->faker->boolean(70), // 70% de chance d'être facturable
        ];
    }
}
