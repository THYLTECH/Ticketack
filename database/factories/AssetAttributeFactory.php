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
        $definitions = [
            'Serial Number' => fn () => $this->faker->bothify('SN-###-???'),
            'Model'         => fn () => $this->faker->randomElement(['Dell R740', 'HP ProLiant', 'Cisco 2960', 'Synology RS']),
            'Location'      => fn () => $this->faker->randomElement(['Room A', 'Room B', 'Rack 1', 'Rack 2']),
            'Version'       => fn () => $this->faker->randomFloat(1, 1, 9),
            'IP Address'    => fn () => $this->faker->ipv4(),
        ];
    
        $key = $this->faker->randomElement(array_keys($definitions));
        $value = $definitions[$key]();
    
        return [
            'key' => $key,
            'value' => $value,
            'asset_id' => null,
        ];
    }
}