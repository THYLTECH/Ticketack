<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

// Seeders
use Database\Seeders\RolesAndPermissionsSeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $user = User::firstOrCreate(
            ['email' => 'hakim.fidjel@gmail.com'],
            [
                'name' => 'Hakim Fidjel',
                'password' => 'password',
                'email_verified_at' => now(),
            ]
        );

        $this->call([
            RolesAndPermissionsSeeder::class,
        ]);

        $user->assignRole('admin');
    }
}
