<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Attachment;

class dummy_UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 5 simple_users 
        for ($i = 1; $i <= 5; $i++) {
            $user = User::create([
                'name' => fake()->name(),
                'email' => "testuser$i@example.com",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
            
            $user->assignRole('simple_user');
        }
        //5 solvers
        for ($i = 1; $i <= 5; $i++) {
            $solver = User::create([
                'name' => fake()->name(),
                'email' => "testsolver$i@example.com",
                'password' => Hash::make('password'),
                'email_verified_at' => now(),
            ]);
            $solver->assignRole('solver');
        }
    }
}