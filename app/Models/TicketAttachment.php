<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;

class TicketAttachment extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'attachment_id',
    ];

    // --- Relations ---
    public function ticket() {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function attachment() {
        return $this->belongsTo(Attachment::class, 'attachment_id');
    }
}