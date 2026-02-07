<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketCommentAttachment extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_comment_id',
        'attachment_id',
    ];

    // --- Relations ---
    public function comment() {
        return $this->belongsTo(TicketComment::class, 'ticket_comment_id');
    }

    public function attachment() {
        return $this->belongsTo(Attachment::class, 'attachment_id');
    }
}