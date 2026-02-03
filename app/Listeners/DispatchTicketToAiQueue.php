<?php

namespace App\Listeners;

use App\Events\TicketCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class DispatchTicketToAiQueue implements ShouldQueue
{
    const QUEUE_NAME = 'ticket_processing_queue';

    public function handle(TicketCreated $event): void
    {
        try {
            // Create pending suggestion
            $suggestion = \App\Models\AiSuggestion::create([
                'ticket_id' => $event->ticket->id,
            ]);

            $payload = [
                'ticket_id' => $event->ticket->id,
                'suggestion_id' => $suggestion->id,
                'title' => $event->ticket->title,
                'description' => $event->ticket->description,
                'status' => 'pending_analysis'
            ];

            // Usage of the 'ai_worker' connection defined above
            // This avoids the 'laravel_database_' prefix
            Redis::connection('ai_worker')->rpush(self::QUEUE_NAME, json_encode($payload));

            Log::info("Ticket #{$event->ticket->id} pushed to AI queue (via Redis:ai_worker).");

        } catch (\Exception $e) {
            Log::error("Error pushing ticket to AI queue: " . $e->getMessage());
            throw $e;
        }
    }
}
