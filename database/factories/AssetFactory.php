<?php

namespace Database\Factories;

use App\Models\Asset;
use App\Models\AssetAttribute;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Asset>
 */
class AssetFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Asset::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'parent_id' => null,
            'title' => $this->faker->words(3, true),
            'description' => $this->faker->optional(0.7)->sentence(),
            'icon' => $this->faker->optional(0.3)->randomElement(['server', 'laptop', 'router', 'wrench', 'cube', 'box']),
        ];
    }

    /**
     * Indicate that the asset is a child of another asset.
     *
     * @return static
     */
    public function childOf(Asset $parent): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parent->id,
        ]);
    }

    /**
     * Configure the factory to create attributes.
     *
     * @return static
     */
    public function configure(): static
    {
        return $this->hasAttributes();
    }

    /**
     * Attach a given number of attributes to the asset.
     *
     * @param int $count
     * @return static
     */
    public function hasAttributes(int $count = 1): static
    {
        return $this->afterCreating(function (Asset $asset) use ($count) {
            AssetAttribute::factory()->count($count)->create([
                'asset_id' => $asset->id,
            ]);
        });
    }

    /**
     * Indicate that the asset should be soft deleted (trashed).
     *
     * @return static
     */
    public function trashed(): static
    {
        return $this->state(fn (array $attributes) => [
            'deleted_at' => $this->faker->dateTimeThisMonth(),
        ]);
    }
}