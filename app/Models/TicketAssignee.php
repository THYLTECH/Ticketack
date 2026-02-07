<?php

namespace App\Models;

use Database\Factories\TicketAssigneeFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Auth;

class TicketAssignee extends Model
{
    /** @use HasFactory<TicketAssigneeFactory> */
    use HasFactory;

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'role_title',
        'role_description',
    ];

    /**
     * @return BelongsTo
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class, 'ticket_id');
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
        static::created(function (TicketAssignee $assignee) {
            $user = User::find($assignee->user_id);

            $authorId = Auth::id() ?? $assignee->ticket->author_id;

            $assignee->ticket->logs()->create([
                'user_id'   => $authorId,
                'action'    => 'assigned',
                'field'     => 'assignee',
                'new_value' => $user->name ?? 'Unknown',
            ]);
        });

        static::deleted(function (TicketAssignee $assignee) {
            $user = User::find($assignee->user_id);

            $assignee->ticket->logs()->create([
                'user_id'   => Auth::id(),
                'action'    => 'unassigned',
                'field'     => 'assignee',
                'old_value' => $user->name ?? 'Unknown',
            ]);
        });
    }
}
