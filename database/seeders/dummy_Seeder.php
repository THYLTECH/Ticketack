<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;

class dummy_Seeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            dummy_UserSeeder::class,
            dummy_AssetSeeder::class,
            dummy_TicketSeeder::class,
            dummy_TicketEntrySeeder::class,
            dummy_TicketScheduleSeeder::class,
        ]);
    }
}