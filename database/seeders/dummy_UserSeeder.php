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
        $createdCount = 0;
        
        // 5 simple_users 
        for ($i = 1; $i <= 5; $i++) {
            $user = User::firstOrCreate(
                ['email' => "testuser$i@example.com"],
                [
                    'name' => fake()->name(),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            
            if (!$user->hasRole('simple_user')) {
                $user->assignRole('simple_user');
            }
            
            if ($user->wasRecentlyCreated) {
                $createdCount++;
            }
        }
        
        //5 solvers
        for ($i = 1; $i <= 5; $i++) {
            $solver = User::firstOrCreate(
                ['email' => "testsolver$i@example.com"],
                [
                    'name' => fake()->name(),
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                ]
            );
            
            if (!$solver->hasRole('solver')) {
                $solver->assignRole('solver');
            }
            
            if ($solver->wasRecentlyCreated) {
                $createdCount++;
            }
        }
        
        $this->command->info("$createdCount new users created (skipped existing).");
    }
}