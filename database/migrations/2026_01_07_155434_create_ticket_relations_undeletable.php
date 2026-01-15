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
        Schema::table('ticket_priorities', function (Blueprint $table) {
            $table->boolean('locked')->default(false);
        });

        Schema::table('ticket_statuses', function (Blueprint $table) {
            $table->boolean('locked')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ticket_priorities', function (Blueprint $table) {
            $table->dropColumn('locked');
        });

        Schema::table('ticket_statuses', function (Blueprint $table) {
            $table->dropColumn('locked');
        });
    }
};
