<?php

namespace Database\Factories;

use App\Models\AssetAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AssetAttribute>
 */
class AssetAttributeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = AssetAttribute::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // Crée des clés d'attributs courantes (Serial Number, Model, etc.)
            'key' => $this->faker->randomElement(['Serial Number', 'Model', 'Location', 'Version', 'IP Address']),
            
            // Crée une valeur pertinente pour la clé
            'value' => match($this->faker->numberBetween(1, 5)) {
                1 => $this->faker->bothify('SN-###-???'), // Serial Number
                2 => $this->faker->word(),               // Model
                3 => $this->faker->randomElement(['Room A', 'Rack 1', 'Storage']), // Location
                4 => $this->faker->randomFloat(1, 1, 9),  // Version (e.g., 2.5)
                5 => $this->faker->ipv4(),               // IP Address
                default => $this->faker->word()
            },
            
            'asset_id' => null, // Doit être défini lors de l'association
        ];
    }
}