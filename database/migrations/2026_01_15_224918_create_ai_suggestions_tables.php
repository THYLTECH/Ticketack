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
        Schema::create('ai_suggestions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('tickets')->onDelete('cascade');
            $table->json('model_config_snapshot')->comment('Version du modèle et paramètres (temp, top_p) au moment du tirage');
            $table->char('prompt_hash', 64)->comment('Empreinte du template de prompt utilisé');
            $table->json('generated_content')->comment('La réponse structurée brute de l IA');
            $table->json('retrieved_chunks')->nullable()->comment('IDs et scores des documents RAG utilisés');
            $table->float('confidence_score')->nullable();
            $table->integer('processing_time_ms')->nullable();
            $table->timestamps();
        });

        Schema::create('ai_feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('suggestion_id')->constrained('ai_suggestions')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->enum('action_type', ['accepted', 'edited', 'rejected']);
            $table->text('final_content')->nullable()->comment('Contenu final réellement envoyé au client');
            $table->enum('rejection_reason', ['hallucination', 'irrelevant', 'outdated', 'unsafe', 'other'])->nullable();
            $table->text('rejection_comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_feedbacks');
        Schema::dropIfExists('ai_suggestions');
    }
};
