<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketAssignee;
use App\Models\User;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\TicketCategory;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class dummy_TicketSeeder extends Seeder
{
    public function run(): void
    {
        $simpleUsers = User::role('simple_user')->get();
        $solvers = User::role('solver')->get();
        $assets = Asset::all();

        if ($simpleUsers->isEmpty() || $solvers->isEmpty() || $assets->isEmpty()) {
            $this->command->warn("Assurez-vous d'avoir lancé DummyUserSeeder et DummyAssetSeeder avant.");
            return;
        }

        for ($i = 0; $i < 20; $i++) {
            $createdAt = Carbon::now()->startOfMonth()->addDays(rand(0, Carbon::now()->day - 1));
            $asset = $assets->random();
            $ticket = Ticket::factory()
                ->withContext($asset->icon ?? 'generic') 
                ->create([
                'author_id' => $simpleUsers->random()->id,
                'asset_id' => $asset->id,
                'created_at' => $createdAt,
            ]);
            $assignedSolvers = $solvers->random(rand(1, 2));
            
            foreach ($assignedSolvers as $solver) {
                TicketAssignee::create([
                    'ticket_id' => $ticket->id,
                    'user_id' => $solver->id,
                    'created_at' => $createdAt,
                ]);
            }
        }
        $this->referencedTickets($simpleUsers);
        $this->command->info('Tickets created successfully.');
    }

    public function referencedTickets($simpleUsers) : void 
    {
        Ticket::updateOrCreate(['id' => 1102], [
            'title' => "Écrans externes noirs via la station d’accueil",
            'description' => "Je viens d’arriver au bureau. Mon ordinateur portable se charge lorsqu’il est branché à la station d’accueil USB-C, mais mes deux écrans externes Dell restent noirs.",
            'detailed_solution' => "Inspection physique du poste de travail. - Remplacement de la station d’accueil par une unité de rechange afin de confirmer la panne matérielle. - La station d’accueil d’origine (modèle WD19) nécessitait une mise à jour du micrologiciel.",
            'author_id' => $simpleUsers->random()->id,
            'priority_id' => TicketPriority::get()->random()->id,
            'category_id' => TicketCategory::get()->random()->id,
            'status_id' => TicketStatus::where('is_closed', true)->first()->id,
            'created_at' => Carbon::parse('2025-10-30'),
        ]);

        Ticket::updateOrCreate(['id' => 4921], [
            'title' => "Échec de la connexion VPN – Erreur 809",
            'description' => "Bonjour, j’essaie de travailler depuis mon domicile aujourd’hui mais je n’arrive pas à me connecter au VPN de l’entreprise.",
            'detailed_solution' => "1. Connexion au bureau à distance établie via TeamViewer. 2. Vérification des journaux du pare-feu Windows ; constat que les ports UDP 500 et 4500 étaient bloqués.",
            'author_id' => $simpleUsers->random()->id,
            'priority_id' => TicketPriority::get()->random()->id,
            'category_id' => TicketCategory::get()->random()->id,
            'status_id' => TicketStatus::where('is_closed', true)->first()->id,
            'created_at' => Carbon::parse('2025-12-21'),
        ]);

        Ticket::updateOrCreate(['id' => 8534], [
            'title' => "Excel se fige lors de l’exécution de la macro T4",
            'description' => "À chaque fois que j’essaie d’exécuter la macro « Consolidate_Q4 » dans le fichier de rapport financier, Excel se fige complètement.",
            'detailed_solution' => "Analyse du fichier « Financial_Report_2025.xlsm ». - Nettoyage des lignes vides et optimisation de la boucle VBA pour cibler uniquement les cellules utilisées.",
            'author_id' => $simpleUsers->random()->id,
            'priority_id' => TicketPriority::get()->random()->id,
            'category_id' => TicketCategory::get()->random()->id,
            'status_id' => TicketStatus::where('is_closed', true)->first()->id,
            'created_at' => Carbon::parse('2025-11-05'),
        ]);
    }
    
}