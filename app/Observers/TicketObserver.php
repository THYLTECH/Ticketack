<?php

namespace App\Observers;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use Illuminate\Support\Facades\Auth;

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
