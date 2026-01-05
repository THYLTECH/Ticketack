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

        // Création des auteurs spécifiques pour les tickets importés
        $moss = User::firstOrCreate(['name' => 'Maurice Moss'], ['email' => 'moss@reynholm.com', 'password' => bcrypt('password')]);
        $sarah = User::firstOrCreate(['name' => 'Sarah Connor'], ['email' => 's.connor@sky.net', 'password' => bcrypt('password')]);
        $elliot = User::firstOrCreate(['name' => 'Elliot Alderson'], ['email' => 'e.alderson@fsociety.com', 'password' => bcrypt('password')]);

        // 4. Récupération des assets
        $allAssets = Asset::all();
        $defaultPriority = $structure['priorities']->first()->id;
        $defaultCategory = $structure['categories']->first()->id;
        $closedStatus = TicketStatus::where('title', 'Fermé')->first()->id;

        // 5. Ajout des tickets spécifiques avec IDs fixes
        Ticket::updateOrCreate(['id' => 1102], [
            'title' => "Écrans externes noirs via la station d’accueil",
            'description' => "Je viens d’arriver au bureau. Mon ordinateur portable se charge lorsqu’il est branché à la station d’accueil USB-C, mais mes deux écrans externes Dell restent noirs.",
            'detailed_solution' => "Inspection physique du poste de travail. - Remplacement de la station d’accueil par une unité de rechange afin de confirmer la panne matérielle. - La station d’accueil d’origine (modèle WD19) nécessitait une mise à jour du micrologiciel.",
            'author_id' => $moss->id,
            'priority_id' => $defaultPriority,
            'category_id' => $defaultCategory,
            'status_id' => $closedStatus,
            'created_at' => Carbon::parse('2025-10-30'),
        ]);

        Ticket::updateOrCreate(['id' => 4921], [
            'title' => "Échec de la connexion VPN – Erreur 809",
            'description' => "Bonjour, j’essaie de travailler depuis mon domicile aujourd’hui mais je n’arrive pas à me connecter au VPN de l’entreprise.",
            'detailed_solution' => "1. Connexion au bureau à distance établie via TeamViewer. 2. Vérification des journaux du pare-feu Windows ; constat que les ports UDP 500 et 4500 étaient bloqués.",
            'author_id' => $sarah->id,
            'priority_id' => $defaultPriority,
            'category_id' => $defaultCategory,
            'status_id' => $closedStatus,
            'created_at' => Carbon::parse('2025-12-21'),
        ]);

        Ticket::updateOrCreate(['id' => 8534], [
            'title' => "Excel se fige lors de l’exécution de la macro T4",
            'description' => "À chaque fois que j’essaie d’exécuter la macro « Consolidate_Q4 » dans le fichier de rapport financier, Excel se fige complètement.",
            'detailed_solution' => "Analyse du fichier « Financial_Report_2025.xlsm ». - Nettoyage des lignes vides et optimisation de la boucle VBA pour cibler uniquement les cellules utilisées.",
            'author_id' => $elliot->id,
            'priority_id' => $defaultPriority,
            'category_id' => $defaultCategory,
            'status_id' => $closedStatus,
            'created_at' => Carbon::parse('2025-11-05'),
        ]);

        // 6. Génération de 50 Tickets aléatoires
        Ticket::factory()->count(50)->make()->each(function ($ticket) use ($users, $allAssets, $structure, $faker) {
            $createdAt = $faker->dateTimeBetween('-1 month', '-1 day');
            $updatedAt = $faker->dateTimeBetween($createdAt, 'now');

            $ticket->author_id = $users->random()->id;
            $ticket->asset_id = $allAssets->random()->id;
            $ticket->priority_id = $structure['priorities']->random()->id;
            $ticket->status_id = $structure['statuses']->random()->id;
            $ticket->category_id = $structure['categories']->random()->id;

            $ticket->created_at = $createdAt;
            $ticket->updated_at = $updatedAt;
            $ticket->save();

            $assigneesCount = rand(1, 2);
            $potentialAssignees = $users->random($assigneesCount);

            foreach ($potentialAssignees as $user) {
                TicketAssignee::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $user->id,
                    'role_title' => 'Intervenant',
                    'created_at' => $createdAt,
                    'updated_at' => $updatedAt,
                ]);
            }
        });

        $this->command->info('Tickets spécifiques et 50 tickets historiques générés avec succès.');
    }

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
            TicketPriority::updateOrCreate(['sort_order' => $i], ['title' => $t, 'color' => '#444'])),

            'statuses' => collect(['Nouveau', 'En cours', 'Résolu', 'Fermé'])->map(fn($t, $i) =>
            TicketStatus::updateOrCreate(['sort_order' => $i], [
                'title' => $t,
                'color' => '#444',
                'is_default' => ($i == 0),
                'is_closed' => ($i > 1)
            ])),

            'categories' => collect(['Logiciel', 'Matériel', 'Réseau'])->map(fn($t, $i) =>
            TicketCategory::updateOrCreate(['sort_order' => $i], [
                'title' => $t,
                'color' => '#444',
                'icon' => 'tag'
            ])),
        ];
    }
}
