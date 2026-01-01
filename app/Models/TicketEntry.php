<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

/**
 * @property int $id
 * @property int $ticket_id
 * @property int $user_id
 * @property string|null $note
 * @property Carbon $start_at
 * @property Carbon $end_at
 * @property int $duration_seconds
 * @property bool $billable
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 * @property-read Ticket $ticket
 * @property-read User $user
 * @mixin Builder
 */
class TicketEntry extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'note',
        'start_at',
        'end_at',
        'duration_seconds',
        'billable',
    ];

    protected $casts = [
        'start_at' => 'datetime',
        'end_at' => 'datetime',
        'billable' => 'boolean',
        'duration_seconds' => 'integer',
    ];

    /**
     * @return BelongsTo
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return void
     */
    protected static function booted(): void
    {
        static::created(function (TicketEntry $entry) {
            $duration = round($entry->duration_seconds / 60);
            $billable = $entry->billable ? 'Billable' : 'Non-billable';
            $note = $entry->note ? " - Note: $entry->note" : "";

            $entry->ticket->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'time_logged',
                'field' => 'entry',
                'new_value' => "$duration min recorded ($billable)$note",
            ]);
        });

        static::deleted(function (TicketEntry $entry) {
            $duration = round($entry->duration_seconds / 60);

            $entry->ticket->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'time_deleted',
                'field' => 'entry',
                'old_value' => "Entry of $duration min removed",
            ]);
        });
    }
}
