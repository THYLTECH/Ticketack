<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Ticket extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'author_id',
        'priority_id',
        'status_id',
        'category_id',
        'asset_id',
        'title',
        'description',
    ];

    // --- Relations ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function priority(): BelongsTo
    {
        return $this->belongsTo(TicketPriority::class);
    }

    public function status(): BelongsTo
    {
        return $this->belongsTo(TicketStatus::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class);
    }

    // Relations vers les tables satellites (Logs, Commentaires, etc.)

    public function assignees(): HasMany
    {
        return $this->hasMany(TicketAssignee::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(TicketLog::class);
    }

    public function entries(): HasMany
    {
        return $this->hasMany(TicketEntry::class);
    }

    public function schedules(): HasMany
    {
        return $this->hasMany(TicketSchedule::class);
    }

    public function attachments() {
        return $this->hasManyThrough(
            Attachment::class,
            TicketAttachment::class,
            'ticket_id', // Foreign key on the pivot table
            'id', // Foreign key on the attachments table
            'id', // Local key on the comments table
            'attachment_id' // Local key on the pivot table
        );
    }
}
