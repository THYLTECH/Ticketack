<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->json('onboarding_state')->nullable()->after('has_completed_onboarding');
        });

        DB::table('users')->where('has_completed_onboarding', true)->update([
            'onboarding_state' => json_encode([
                'welcome' => true,
                'home' => true,
                'tickets' => true,
                'ticket_detail' => true,
                'create_ticket' => true,
                'notifications' => true,
                'settings' => true,
            ]),
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('has_completed_onboarding');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('has_completed_onboarding')->default(false)->after('onboarding_state');
        });

        DB::table('users')->whereNotNull('onboarding_state')->update([
            'has_completed_onboarding' => true,
        ]);

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('onboarding_state');
        });
    }
};
