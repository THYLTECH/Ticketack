<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

/**
 * Attachment Model
 *
 * Represents a file attachment in the system.
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
    protected $fillable = [
        'title',
        'description',
        'file_name',
        'file_path',
        'mime_type',
        'file_extension',
        'file_size',
    ];

    /**
     * A file can be the avatar of a user.
     */
    public function user(): HasOne
    {
        return $this->hasOne(User::class, 'attachment_avatar');
    }

    public function getUrl(): string
    {
        return Storage::url($this->file_path);
    }
}
