<?php

namespace Database\Seeders;

use App\Models\Asset;
use Illuminate\Database\Seeder;

class dummy_AssetSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 10; $i++) {
            $newAsset = Asset::factory()->create();

            if (fake()->boolean(40)) {
                // On cherche un "enfant" potentiel parmi les assets déjà créés 
                // qui n'ont pas encore de parent et qui ne sont pas l'asset actuel
                $potentialChild = Asset::whereNull('parent_id')
                    ->where('id', '!=', $newAsset->id)
                    ->inRandomOrder()
                    ->first();

                if ($potentialChild) {
                    // L'asset nouvellement créé devient le parent de l'existant
                    $potentialChild->update(['parent_id' => $newAsset->id]);
                }
            }
        }
        $this-> command->info('10 assets dummy created with hierarchical relationships.');
    }
}