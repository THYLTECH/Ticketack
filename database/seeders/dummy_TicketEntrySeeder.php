<?php

namespace Database\Seeders;

use App\Models\Ticket;
use App\Models\TicketEntry;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;

class dummy_TicketEntrySeeder extends Seeder
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
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
        $period = CarbonPeriod::create($startDate, $endDate);

        foreach ($solvers as $solver) {
            Auth::login($solver);

            foreach ($period as $date) {
                if ($date->isWeekend()) {
                    continue;
                }
                $startAt = $date->copy()->setHour(rand(8, 16))->setMinute(0)->setSecond(0);
                
                $hours = rand(1, 4);
                $endAt = $startAt->copy()->addHours($hours);

                TicketEntry::create([
                    'ticket_id'        => $tickets->random()->id,
                    'user_id'          => $solver->id,
                    'note'             => fake()->realText(150),
                    'start_at'         => $startAt,
                    'end_at'           => $endAt,
                    'duration_seconds' => $hours * 3600, // Conversion en secondes
                    'billable'         => fake()->boolean(90),
                    'created_at'       => $startAt,
                    'updated_at'       => $startAt,
                ]);
            }
        }

        Auth::logout();
        $this->command->info('Entries dummy created for solvers over the past month.');
    }
}