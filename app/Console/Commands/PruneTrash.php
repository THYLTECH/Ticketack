<?php

namespace App\Console\Commands;

use App\Models\Asset;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\TrashRetention;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class PruneTrash extends Command
{
    protected $signature = 'trash:prune';
    protected $description = 'Permanently delete soft-deleted items based on retention policy.';

    public function handle()
    {
        $models = [
            'ticket' => Ticket::class,
            'user'   => User::class,
            'role'   => Role::class,
            'asset'  => Asset::class,
        ];

        $totalDeleted = 0;

        foreach ($models as $type => $modelClass) {
            $retention = TrashRetention::where('type', $type)->first();
            $days = $retention ? $retention->days : 30;

            $cutoffDate = now()->subDays($days);

            $this->info(__('trash.console.pruning', [
                'type' => $type,
                'date' => $cutoffDate->toDateTimeString(),
                'days' => $days,
            ]));

            $query = $modelClass::onlyTrashed()->where('deleted_at', '<', $cutoffDate);

            $count = 0;
            foreach ($query->cursor() as $item) {
                $item->forceDelete();
                $count++;
            }

            if ($count > 0) {
                $totalDeleted += $count;
            }
        }

        $message = __('trash.console.summary', ['count' => $totalDeleted]);

        $this->info($message);
        Log::info($message);
    }
}
