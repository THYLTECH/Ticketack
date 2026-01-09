<?php

namespace App\Models;

use Database\Factories\AttachmentFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

/**
 * Attachment Model
 *
 * @property string $title
 * @property string $description
 * @property string $file_name
 * @property string $file_path
 * @property string $mime_type
 * @property string $file_extension
 * @property int $file_size
 */
class Attachment extends Model
{
    /** @use HasFactory<AttachmentFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'file_name',
        'file_path',
        'mime_type',
        'file_extension',
        'file_size',
        'user_id',
    ];

    protected $appends = ['url'];

    /**
     * @return HasMany
     */
    public function user(): HasMany
    {
        return $this->hasMany(User::class, 'attachment_avatar');
    }

    /**
     * @return BelongsToMany
     */
    public function comments(): BelongsToMany
    {
        return $this->belongsToMany(
            TicketComment::class,
            'ticket_comment_attachments',
            'attachment_id',
            'ticket_comment_id'
        );
    }

    /**
     * @return void
     */
    protected static function booted(): void
    {
        static::created(function (Attachment $attachment) {
            $comment = $attachment->comments()->first();
            $ticket = $comment?->ticket;

            if ($ticket && Auth::check()) {
                $ticket->logs()->create([
                    'user_id' => Auth::id(),
                    'action' => 'attachment_added',
                    'field' => 'attachment',
                    'new_value' => $attachment->file_name,
                ]);
            }
        });

        static::deleting(function (Attachment $attachment) {
            $attachment->load('comments.ticket');

            $comment = $attachment->comments()->first();
            $ticket = $comment?->ticket;

            if ($ticket && Auth::check()) {
                $ticket->logs()->create([
                    'user_id' => Auth::id(),
                    'action' => 'attachment_deleted',
                    'field' => 'attachment',
                    'old_value' => $attachment->file_name,
                ]);
            }
        });
    }

    /**
     * Pour Tests\Unit\AssetModelsTest.php
     */
    public function getUrl(): string
    {
        return $this->file_path ? Storage::url($this->file_path) : '';
    }

    /**
     * Pour les tests API et l'attribut calculé 'url'
     */
    public function getUrlAttribute(): string
    {
        return $this->getUrl();
    }
}
