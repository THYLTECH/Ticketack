<?php

namespace App\Observers;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TicketObserver
{
    /**
     * @var array<string, string>
     */
    private array $fieldLabels = [
        'priority_id' => 'priority',
        'status_id'   => 'status',
        'category_id' => 'category',
        'asset_id'    => 'equipment',
        'title'       => 'title',
        'description' => 'description',
        'is_public'   => 'visibility',
        'archived_at' => 'archive_status',
    ];

    /**
     * @param Ticket $ticket
     * @return void
     */
    public function created(Ticket $ticket): void
    {
        $this->logAction($ticket, 'created');

        if ($ticket->status?->is_closed && !empty($ticket->detailed_solution)) {
            DB::afterCommit(fn() => $this->exportToMinio($ticket));
        }
    }

    /**
     * @param Ticket $ticket
     * @return void
     */
    public function updated(Ticket $ticket): void
    {
        foreach ($ticket->getDirty() as $field => $newValue) {
            if (in_array($field, ['updated_at', 'deleted_at'])) {
                continue;
            }

            $oldValue = $ticket->getOriginal($field);

            if ($oldValue != $newValue) {
                $label = $this->fieldLabels[$field] ?? $field;

                $formattedOld = $this->formatValue($field, $oldValue);
                $formattedNew = $this->formatValue($field, $newValue);

                $this->logAction($ticket, 'updated', $label, $formattedOld, $formattedNew);
            }
        }

        if ($ticket->wasChanged('is_referenced') && $ticket->is_referenced) {
            if ($ticket->status?->is_closed && !empty($ticket->detailed_solution)) {
                DB::afterCommit(function() use ($ticket) {
                    $this->exportToMinio($ticket);
                    $this->uploadAttachments($ticket);
                });
            }
            return;
        }

        if ($ticket->wasChanged('is_referenced') && !$ticket->is_referenced) {
            $this->dispatchDeleteEvent('delete_ticket', ['ticket_id' => $ticket->id]);
            return;
        }

        if ($ticket->is_referenced) {
            $jsonFields = ['title', 'description', 'detailed_solution', 'author_id', 'status_id'];
            foreach ($jsonFields as $field) {
                if ($ticket->wasChanged($field)) {
                    $filename = "{$ticket->id}.json";

                    $this->dispatchDeleteEvent('delete_file', [
                        'filename' => $filename,
                        'ticket_id' => $ticket->id
                    ]);

                    $this->exportToMinio($ticket);
                    break;
                }
            }
        }
    }

    private function exportToMinio(Ticket $ticket): void
    {
        // Skip S3 export in testing environment
        if (app()->environment('testing')) {
            return;
        }

        $data = [
            'ticket_id'   => $ticket->id,
            'title'       => $ticket->title,
            'description' => $ticket->description,
            'detailed_solution' => $ticket->detailed_solution,
            'author'      => $ticket->user?->name ?? 'Anonyme',
            'closed_at'   => $ticket->updated_at->format('Y-m-d'),
        ];

        $fileName = "{$ticket->id}.json";
        
        try {
            Storage::disk('s3')->put($fileName, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
        } catch (\Throwable $e) {
            Log::warning("Failed to export ticket {$ticket->id} to S3/Minio: " . $e->getMessage());
        }
    }

    private function uploadAttachments(Ticket $ticket): void
    {
        // Skip S3 upload in testing environment
        if (app()->environment('testing')) {
            return;
        }

        $ticket->load('attachments');

        foreach ($ticket->attachments as $attachment) {
            if (Storage::disk('public')->exists($attachment->file_path)) {
                $fileContent = Storage::disk('public')->get($attachment->file_path);
                $minioPath = "tickets-raw/{$ticket->id}_{$attachment->file_name}";

                try {
                    Storage::disk('s3')->put($minioPath, $fileContent);
                    Log::info("Synced attachment to MinIO: {$minioPath}");
                } catch (\Throwable $e) {
                    Log::warning("Failed to sync attachment to S3/Minio: " . $e->getMessage());
                }
            } else {
                Log::warning("Attachment file missing locally for attachment ID: {$attachment->id}");
            }
        }
    }

    private function dispatchDeleteEvent(string $action, array $payload): void
    {
        // Skip Redis in testing environment
        if (app()->environment('testing')) {
            Log::info("ETL Delete Event Skipped (testing): {$action}", $payload);
            return;
        }

        try {
            $message = json_encode([
                'source' => 'laravel_app',
                'action' => $action,
                'payload' => $payload,
                'timestamp' => time()
            ]);

            Redis::rpush('minio_events', $message);

            Log::info("ETL Delete Event Dispatched: {$action}", $payload);
        } catch (\Throwable $e) {
            Log::error("Failed to push to Redis: " . $e->getMessage());
        }
    }

    /**
     * @param string $field
     * @param mixed $value
     * @return string
     */
    private function formatValue(string $field, mixed $value): string
    {
        if (is_null($value)) {
            return 'empty';
        }

        return match ($field) {
            'priority_id' => TicketPriority::find($value)?->title ?? "ID: $value",
            'status_id'   => TicketStatus::find($value)?->title ?? "ID: $value",
            'category_id' => TicketCategory::find($value)?->title ?? "ID: $value",
            'asset_id'    => Asset::find($value)?->title ?? "ID: $value",
            'is_public'   => $value ? 'Public' : 'Private',
            'archived_at' => $value ? 'Archived' : 'Active',
            default       => (string) $value,
        };
    }

    /**
     * @param Ticket $ticket
     * @param string $action
     * @param string|null $field
     * @param string|null $old
     * @param string|null $new
     * @return void
     */
    private function logAction(Ticket $ticket, string $action, ?string $field = null, ?string $old = null, ?string $new = null): void
    {
        $ticket->logs()->create([
            'user_id'   => Auth::id() ?? $ticket->author_id,
            'action'    => $action,
            'field'     => $field,
            'old_value' => $old,
            'new_value' => $new,
        ]);
    }
}
