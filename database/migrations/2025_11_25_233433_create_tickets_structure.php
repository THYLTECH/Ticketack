<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ticket_priorities', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->unique();
            $table->string('color');
            $table->timestamps();
        });

        Schema::create('ticket_statuses', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->unique();
            $table->string('icon')->nullable();
            $table->string('color');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_closed')->default(false);
            $table->timestamps();
        });

        Schema::create('ticket_categories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->integer('sort_order')->unique();
            $table->string('icon')->nullable();
            $table->string('color');
            $table->timestamps();
        });

        // 2. Table Tickets
        Schema::create('tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('author_id')->constrained('users');

            $table->foreignId('priority_id')->constrained('ticket_priorities');
            $table->foreignId('status_id')->constrained('ticket_statuses');
            $table->foreignId('category_id')->constrained('ticket_categories');

            // TODO : Asset (Feature future : on met juste l'ID pour l'instant, sans contrainte forte)
            $table->unsignedBigInteger('asset_id')->nullable()->index();

            $table->string('title');
            $table->text('description');
            $table->timestamps();
            $table->softDeletes(); // "deleted_at"
        });

        Schema::create('ticket_assignees', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('role_title')->nullable();
            $table->text('role_description')->nullable();
            $table->timestamps();
        });

        Schema::create('ticket_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Auteur du commentaire
            $table->foreignId('parent_id')
                ->nullable()
                ->constrained('ticket_comments')
                ->onDelete('set null');
            $table->text('content');
            $table->timestamps();
            $table->softDeletes(); // "deleted_at"
        });

        Schema::create('ticket_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users'); // Qui a fait l'action
            $table->string('action');
            $table->string('field')->nullable();
            $table->text('old_value')->nullable();
            $table->text('new_value')->nullable();
            $table->timestamps();
        });

        Schema::create('ticket_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Celui qui a travaillé
            $table->text('note')->nullable();
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->integer('duration_seconds');
            $table->boolean('billable')->default(false);
            $table->timestamps();
            $table->softDeletes(); // "deleted_at"
        });

        Schema::create('ticket_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained(); // Personne planifiée
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->integer('duration_minutes')->nullable();
            $table->timestamps();
            $table->softDeletes(); // "deleted_at"
        });

        // Tickets <-> Attachments
        Schema::create('ticket_attachments', function (Blueprint $table) {
            $table->foreignId('ticket_id')->constrained()->onDelete('cascade');
            $table->foreignId('attachment_id')->constrained()->onDelete('cascade');
            $table->primary(['ticket_id', 'attachment_id']);
        });

        // Comments <-> Attachments
        Schema::create('ticket_comment_attachments', function (Blueprint $table) {
            $table->foreignId('ticket_comment_id')->constrained()->onDelete('cascade');
            $table->foreignId('attachment_id')->constrained()->onDelete('cascade');
            $table->primary(['ticket_comment_id', 'attachment_id'], 'comment_attach_pk');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ticket_comment_attachments');
        Schema::dropIfExists('ticket_attachments');
        Schema::dropIfExists('ticket_schedules');
        Schema::dropIfExists('ticket_entries');
        Schema::dropIfExists('ticket_logs');
        Schema::dropIfExists('ticket_comments');
        Schema::dropIfExists('ticket_assignees');
        Schema::dropIfExists('tickets');
        Schema::dropIfExists('ticket_categories');
        Schema::dropIfExists('ticket_statuses');
        Schema::dropIfExists('ticket_priorities');
    }
};
