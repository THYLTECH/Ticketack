<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketSchedule;
use Carbon\Carbon;

class TicketScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $solver = User::role('solver')->first();
        $tickets = Ticket::limit(5)->get();

        if (!$solver || $tickets->isEmpty()) {
            return;
        }

        $baseDate = Carbon::create(2026, 12, 26, 9, 0, 0);

        foreach ($tickets as $index => $ticket) {
            $start = $baseDate->copy()->addDays($index)->addHours($index * 2);

            TicketSchedule::create([
                'ticket_id' => $ticket->id,
                'user_id' => $solver->id,
                'start_date' => $start,
                'end_date' => $start->copy()->addHour(),
                'duration_minutes' => 60,
                'description' => 'Intervention préventive ' . ($index + 1)
            ]);
        }
    }
}
