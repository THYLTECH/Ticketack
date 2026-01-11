<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\TicketCategory;

class TicketStructureSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->seedTicketStructure();
        $this->command->info('Ticket structure seeded successfully.');
    }

    private function seedTicketStructure(): array
    {
        $priorities = [
            ['title' => __('seeders.priorities.low'), 'sort_order' => 0, 'color' => '#22C55E'],
            ['title' => __('seeders.priorities.medium'), 'sort_order' => 1, 'color' => '#EAB308'],
            ['title' => __('seeders.priorities.high'), 'sort_order' => 2, 'color' => '#EF4444'],
        ];

        $statuses = [
            ['title' => __('seeders.statuses.todo'), 'sort_order' => 0, 'color' => '#94A3B8', 'is_default' => true],
            ['title' => __('seeders.statuses.doing'), 'sort_order' => 1, 'color' => '#0EA5E9'],
            ['title' => __('seeders.statuses.done'), 'sort_order' => 2, 'color' => '#10B981', 'is_closed' => true],
        ];

        $categories = [
            ['title' => __('seeders.categories.software'), 'sort_order' => 0, 'color' => '#6366F1', 'icon' => 'monitor'],
            ['title' => __('seeders.categories.hardware'), 'sort_order' => 1, 'color' => '#F43F5E', 'icon' => 'cpu'],
            ['title' => __('seeders.categories.network'), 'sort_order' => 2, 'color' => '#10B981', 'icon' => 'wifi'],
        ];

        foreach ($priorities as $p) TicketPriority::updateOrCreate(['sort_order' => $p['sort_order']], $p);
        foreach ($statuses as $s) TicketStatus::updateOrCreate(['sort_order' => $s['sort_order']], $s);
        foreach ($categories as $c) TicketCategory::updateOrCreate(['sort_order' => $c['sort_order']], $c);
        return [
            'priorities' => TicketPriority::all(),
            'statuses' => TicketStatus::all(),
            'categories' => TicketCategory::all(),
        ];
    }
}
