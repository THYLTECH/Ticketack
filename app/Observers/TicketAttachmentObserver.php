<?php

namespace App\Observers;

use App\Models\TicketAttachment;
use Illuminate\Support\Facades\Storage;

class TicketAttachmentObserver
{
    public function created(TicketAttachment $ticketAttachment): void
    {
        $ticket = $ticketAttachment->ticket;
        $attachment = $ticketAttachment->attachment;

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
        
        $jsonSuppression = [
            'supress' => "{$ticketAttachment->ticket_id}_{$attachment->file_name}"
        ];
        // TODO : Envoyer à Redis
    }
    
}