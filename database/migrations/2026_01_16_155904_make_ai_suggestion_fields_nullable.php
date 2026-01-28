<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('ai_suggestions', function (Blueprint $table) {
            $table->json('model_config_snapshot')->nullable()->change();
            $table->char('prompt_hash', 64)->nullable()->change();
            $table->json('generated_content')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ai_suggestions', function (Blueprint $table) {
            // Revert changes (Warning: might fail if null values exist)
            // Ideally we shouldn't revert to non-nullable if data exists, but strict reverse:
            // $table->json('model_config_snapshot')->nullable(false)->change();
            // $table->char('prompt_hash', 64)->nullable(false)->change();
            // $table->json('generated_content')->nullable(false)->change();
        });
    }
};
