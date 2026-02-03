<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

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
        'archived_at',
        'is_referenced',
        'detailed_solution',
    ];

    protected $casts = [
        'archived_at' => 'datetime',
        'is_referenced' => 'boolean',
    ];

    protected $appends = [
        'is_archived',
    ];

    public function getIsArchivedAttribute(): bool
    {
        return !is_null($this->archived_at);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return BelongsTo
     */
    public function priority(): BelongsTo
    {
        return $this->belongsTo(TicketPriority::class);
    }

    /**
     * @return BelongsTo
     */
    public function status(): BelongsTo
    {
        return $this->belongsTo(TicketStatus::class);
    }

    /**
     * @return BelongsTo
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(TicketCategory::class);
    }

    /**
     * @return BelongsTo
     */
    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class);
    }

    /**
     * @return HasMany
     */
    public function assignees(): HasMany
    {
        return $this->hasMany(TicketAssignee::class);
    }

    /**
     * @return HasMany
     */
    public function comments(): HasMany
    {
        return $this->hasMany(TicketComment::class);
    }

    /**
     * @return HasMany
     */
    public function logs(): HasMany
    {
        return $this->hasMany(TicketLog::class);
    }

    /**
     * @return HasMany
     */
    public function entries(): HasMany
    {
        return $this->hasMany(TicketEntry::class);
    }

    /**
     * @return HasMany
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(TicketSchedule::class);
    }

    /**
     * @return HasManyThrough
     */
    public function attachments(): HasManyThrough
    {
        return $this->hasManyThrough(
            Attachment::class,
            TicketAttachment::class,
            'ticket_id',
            'id',
            'id',
            'attachment_id'
        );
    }

    /**
     * @return BelongsTo
     */
    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /**
     * @return HasMany
     */
    public function aiSuggestions(): HasMany
    {
        return $this->hasMany(AiSuggestion::class);
    }

    /**
     * Scope to filter archived tickets
     */
    public function scopeArchived($query)
    {
        return $query->whereNotNull('archived_at');
    }

    /**
     * Scope to filter non-archived tickets
     */
    public function scopeNotArchived($query)
    {
        return $query->whereNull('archived_at');
    }

    /**
     * Check if ticket is archived
     */
    public function isArchived(): bool
    {
        return !is_null($this->archived_at);
    }

    /**
     * Archive the ticket
     */
    public function archive(): void
    {
        $this->archived_at = now();
        $this->save();
    }

    /**
     * Unarchive the ticket
     */
    public function unarchive(): void
    {
        $this->archived_at = null;
        $this->save();
    }
}
