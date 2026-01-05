<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TicketLog extends Model
{
    protected $fillable = [
        'ticket_id',
        'user_id',
        'action',
        'field',
        'old_value',
        'new_value',
    ];

    /**
     * L'utilisateur qui a généré ce log.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Le ticket associé.
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }
}
