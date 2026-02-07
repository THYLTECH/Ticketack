<?php

namespace App\Models;

use Database\Factories\TicketCommentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Auth;

class TicketComment extends Model
{
    /** @use HasFactory<TicketCommentFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'parent_id',
        'content',
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
    public function parent(): BelongsTo
    {
        return $this->belongsTo(TicketComment::class, 'parent_id');
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * @return BelongsToMany
     */
    public function attachments(): BelongsToMany
    {
        return $this->belongsToMany(
            Attachment::class,
            'ticket_comment_attachments',
            'ticket_comment_id',
            'attachment_id'
        )->withTimestamps();
    }

    /**
     * @return void
     */
    protected static function booted(): void
    {
        static::created(function (TicketComment $comment) {
            $comment->ticket?->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'commented',
                'field' => 'comment',
                'new_value' => (string) str($comment->content)->limit(100),
            ]);
        });

        static::updated(function (TicketComment $comment) {
            $comment->ticket?->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'updated a comment',
                'field' => 'comment',
                'old_value' => (string) str($comment->getOriginal('content'))->limit(100),
                'new_value' => (string) str($comment->content)->limit(100),
            ]);
        });

        static::deleted(function (TicketComment $comment) {
            $comment->ticket?->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'comment_deleted',
                'field' => 'comment',
                'old_value' => (string) str($comment->content)->limit(100),
            ]);
        });
    }
}
