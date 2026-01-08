<?php

namespace App\Observers;

use App\Events\TicketCreated;
use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage; // Ajout pour Minio
use Illuminate\Support\Facades\DB;


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
    ];

    /**
     * @param Ticket $ticket
     * @return void
     */
    public function created(Ticket $ticket): void
    {
        $this->logAction($ticket, 'created');

        // Debug log
        Log::info("[Observer] Ticket #{$ticket->id} created. Dispatching event...");

        // Dispatch the TicketCreated event (for AI suggestions)
        TicketCreated::dispatch($ticket);

        // Export to Minio if the ticket is closed upon creation
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
        $jsonFields = ['title', 'description', 'detailed_solution', 'author_id', 'status_id'];

        $shouldExport = false;

        // On vérifie si l'un des champs du JSON a été modifié
        foreach ($jsonFields as $field) {
            if ($ticket->wasChanged($field)) {
                $shouldExport = true;
                break;
            }
        }

        $dirty = $ticket->getDirty();
        if (!$shouldExport && count($dirty) === 1 && isset($dirty['updated_at'])) {
            $shouldExport = true;
        }
        if ($ticket->status?->is_closed && !empty($ticket->detailed_solution)) {
            if ($shouldExport) {
                DB::afterCommit(fn() => $this->exportToMinio($ticket));
            }
    }
    }

    private function exportToMinio(Ticket $ticket): void
    {
        $ticket->loadMissing(['attachments', 'user']);
        $data = [
            'ticket_id'   => $ticket->id,
            'title'       => $ticket->title,
            'description' => $ticket->description,
            'detailed_solution' => $ticket->detailed_solution,
            'author'      => $ticket->user?->name ?? 'Anonyme',
            'closed_at'   => $ticket->updated_at->format('Y-m-d'),
        ];

        $fileName = "{$ticket->id}.json";
        Storage::disk('s3')->put($fileName, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

        foreach ($ticket->attachments as $attachment) {
            if (Storage::disk('public')->exists($attachment->file_path)) {
                $fileContent = Storage::disk('public')->get($attachment->file_path);
                if (!is_null($fileContent)) {
                    $newFileName = "{$ticket->id}_{$attachment->file_name}";
                    $filePath = "{$newFileName}";
                    // Envoi vers le disque S3 (Minio)
                    Storage::disk('s3')->put($filePath, $fileContent);
                }
            }
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
