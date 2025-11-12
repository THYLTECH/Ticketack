<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('notification_preferences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('category'); // ex: 'auth', 'tickets'
            $table->string('type'); // ex: 'ticket_created', 'ticket_assigned', 'account_created'
            $table->enum('channel', ['mail', 'vonage', 'database'])->default('database');
            $table->boolean('enabled')->default(true);
            $table->timestamps();

            $table->unique(['user_id', 'type', 'channel']);
        });

        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            $table->string('category'); // ex: 'auth', 'tickets'
            $table->string('type'); // ex: 'ticket_created', 'ticket_assigned', 'account_created'
            
            $table->string('title');
            $table->text('message')->nullable();
            $table->string('action')->nullable();
            $table->string('action_url')->nullable();
            
            $table->datetime('read_at')->nullable();
            $table->timestamps();
        });   
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('notification_preferences');
    }
};
