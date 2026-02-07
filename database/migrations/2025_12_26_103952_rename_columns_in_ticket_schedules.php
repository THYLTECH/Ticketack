<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ticket_schedules', function (Blueprint $table) {
            $table->renameColumn('start_at', 'start_date');
            $table->renameColumn('end_at', 'end_date');
        });
    }

    public function down(): void
    {
        Schema::table('ticket_schedules', function (Blueprint $table) {
            $table->renameColumn('start_date', 'start_at');
            $table->renameColumn('end_date', 'end_at');
        });
    }
};
