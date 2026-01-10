<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketSchedule;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class dummy_TicketScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $solvers = User::role('solver')->get();
        $tickets = Ticket::all();

        if ($solvers->isEmpty() || $tickets->isEmpty()) {
            $this->command->warn("Veuillez générer des solveurs et des tickets avant.");
            return;
        }

        $startDate = Carbon::now()->addDays(1);
        $endDate = Carbon::now()->addDays(30);
        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($solvers as $solver) {
            Auth::login($solver);

            foreach ($period as $date) {
                if ($date->isWeekend()) {
                    continue;
                }
                $startAt = $date->copy()->setHour(rand(8, 16))->setMinute(0)->setSecond(0);
                
                $durationHours = rand(1, 4);
                $endAt = $startAt->copy()->addHours($durationHours);

                TicketSchedule::create([
                    'ticket_id'        => $tickets->random()->id,
                    'user_id'          => $solver->id,
                    'start_date'       => $startAt,
                    'end_date'         => $endAt,
                    'duration_minutes' => $durationHours * 60,
                ]);
            }
        }

        Auth::logout();
        $this->command->info('Ticket schedules dummy created for solvers over the next month.');
    }
}