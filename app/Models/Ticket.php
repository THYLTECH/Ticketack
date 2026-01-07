<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;

class   Ticket extends Model
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
        'is_public',
        'is_referenced',
        'detailed_solution',
    ];

    protected $casts = [
        'is_public' => 'boolean',
        'is_referenced' => 'boolean',
    ];

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
}
