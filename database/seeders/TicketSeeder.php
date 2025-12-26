<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Ticket;
use App\Models\User;
use App\Models\Asset;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\TicketCategory;
use App\Models\TicketAssignee;
use Carbon\Carbon;
use Faker\Factory as Faker;

class TicketSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        // 1. Structure (Priorités, Statuts, Catégories)
        $structure = $this->seedTicketStructure();

        // 2. Assets fixes
        $this->seedRawAssets();

        // 3. Utilisateurs
        $users = User::factory()->count(15)->create();

        // 4. Récupération des assets
        $allAssets = Asset::all();

        // 5. Génération de 50 Tickets avec dates antérieures
        Ticket::factory()->count(50)->make()->each(function ($ticket) use ($users, $allAssets, $structure, $faker) {
            
            // --- Logique des dates ---
            // On génère une date de création entre il y a 1 an et il y a 1 mois
            $createdAt = $faker->dateTimeBetween('-1 month', '-1 day');
            // On génère une date de mise à jour entre la création et aujourd'hui
            $updatedAt = $faker->dateTimeBetween($createdAt, 'now');

            // Association des relations
            $ticket->author_id = $users->random()->id;
            $ticket->asset_id = $allAssets->random()->id;
            $ticket->priority_id = $structure['priorities']->random()->id;
            $ticket->status_id = $structure['statuses']->random()->id;
            $ticket->category_id = $structure['categories']->random()->id;
            
            // On force les dates manuellement avant la sauvegarde
            $ticket->created_at = $createdAt;
            $ticket->updated_at = $updatedAt;
            $ticket->save();

            // 6. Assignations (avec les mêmes dates pour la cohérence)
            $assigneesCount = rand(1, 2);
            $potentialAssignees = $users->random($assigneesCount);

            foreach ($potentialAssignees as $user) {
                TicketAssignee::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $user->id,
                    'role_title' => 'Intervenant',
                    'created_at' => $createdAt, // Cohérence historique
                    'updated_at' => $updatedAt,
                ]);
            }
        });

        $this->command->info('50 tickets historiques générés avec succès.');
    }

    // ... (méthodes seedRawAssets et seedTicketStructure identiques au précédent)
    
    private function seedRawAssets(): void
    {
        $data = [
            ['title' => 'Serveur PROD-01', 'description' => 'Hébergement principal.', 'icon' => 'server', 'attributes' => ['IP' => '192.168.1.50']],
            ['title' => 'Poste Lead Dev', 'description' => 'MacBook Pro 16.', 'icon' => 'laptop', 'attributes' => ['S/N' => 'APP987']]
        ];

        foreach ($data as $assetData) {
            $attributes = $assetData['attributes'];
            unset($assetData['attributes']);
            $asset = Asset::updateOrCreate(['title' => $assetData['title']], $assetData);
            foreach ($attributes as $key => $value) {
                $asset->attributes()->updateOrCreate(['key' => $key], ['value' => $value]);
            }
        }
    }

    private function seedTicketStructure(): array
    {
        return [
            'priorities' => collect(['Basse', 'Moyenne', 'Haute', 'Urgente'])->map(fn($t, $i) => 
                TicketPriority::updateOrCreate(['title' => $t], ['color' => '#444', 'sort_order' => $i])),
            'statuses' => collect(['Nouveau', 'En cours', 'Résolu', 'Fermé'])->map(fn($t, $i) => 
                TicketStatus::updateOrCreate(['title' => $t], ['color' => '#444', 'sort_order' => $i, 'is_default' => ($i==0), 'is_closed' => ($i > 1)])),
            'categories' => collect(['Logiciel', 'Matériel', 'Réseau'])->map(fn($t, $i) => 
                TicketCategory::updateOrCreate(['title' => $t], ['color' => '#444', 'sort_order' => $i, 'icon' => 'tag'])),
        ];
    }
}