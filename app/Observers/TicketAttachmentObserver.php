<?php

namespace App\Observers;

use App\Models\TicketAttachment;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class TicketAttachmentObserver
{
    public function created(TicketAttachment $ticketAttachment): void
    {
        $ticket = $ticketAttachment->ticket;
        $attachment = $ticketAttachment->attachment;

        // Only process if the parent ticket is referenced (public)
        if (!$ticket || !$ticket->is_referenced) {
            return;
        }

        if ($ticket && $attachment && Storage::disk('public')->exists($attachment->file_path)) {
            $fileContent = Storage::disk('public')->get($attachment->file_path);
            $fileName = "{$ticket->id}_{$attachment->file_name}";
            // Envoi vers Minio (S3)
            Storage::disk('s3')->put($fileName, $fileContent);
        }
    }

    public function deleting(TicketAttachment $ticketAttachment): void
    {
        $attachment = $ticketAttachment->attachment;
        $ticket = $ticketAttachment->ticket;
        $fileName = "{$ticket->id}_{$attachment->file_name}";
        $minioFilename = "tickets-raw/{$ticket->id}_{$attachment->file_name}";

        // 1. Delete from MinIO
        if (Storage::disk('s3')->exists($minioFilename)) {
            Storage::disk('s3')->delete($minioFilename);
        }

        // 2. Dispatch delete event to LanceDB via Redis
        $this->dispatchDeleteEvent('delete_file', [
            'filename' => $fileName,
            'ticket_id' => $ticketAttachment->ticket_id
        ]);
    }

    /**
     * Helper to push task to Redis queue for ETL.
     */
    private function dispatchDeleteEvent(string $action, array $payload): void
    {
        try {
            $message = json_encode([
                'source' => 'laravel_app',
                'action' => $action,
                'payload' => $payload,
                'timestamp' => time()
            ]);

            Redis::rpush('minio_events', $message);

            Log::info("Attachment Delete Event Dispatched: {$action}", $payload);
        } catch (\Exception $e) {
            Log::error("Failed to push to Redis: " . $e->getMessage());
        }
    }
}
