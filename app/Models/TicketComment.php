<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketComment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'parent_id',
        'content',
    ];

    // --- Relations ---
    public function ticket() {
        return $this->belongsTo(Ticket::class);
    }

    public function parent() {
        return $this->belongsTo(TicketComment::class, 'parent_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function attachments() {
        return $this->hasManyThrough(
            Attachment::class,
            TicketCommentAttachment::class,
            'ticket_comment_id', // Foreign key on the pivot table
            'id', // Foreign key on the attachments table
            'id', // Local key on the comments table
            'attachment_id' // Local key on the pivot table
        );
    }
}
