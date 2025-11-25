<?php

namespace Database\Factories;

use App\Models\Attachment;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attachment>
 */
class AttachmentFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Attachment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $extension = $this->faker->randomElement(['pdf', 'jpg', 'png', 'svg', 'zip']);
        $fileName = $this->faker->slug(3) . '.' . $extension;
        $mimeType = match ($extension) {
            'pdf' => 'application/pdf',
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'svg' => 'image/svg+xml',
            'zip' => 'application/zip',
            default => 'application/octet-stream',
        };
        
        // Simule un chemin de fichier réaliste dans le stockage public
        $filePath = 'assets/' . Str::uuid() . '/' . $fileName;

        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->optional(0.5)->paragraph(1),
            'file_name' => $fileName,
            'file_path' => $filePath,
            'mime_type' => $mimeType,
            'file_extension' => $extension,
            'file_size' => $this->faker->numberBetween(1024, 5242880), // 1KB to 5MB
        ];
    }
}