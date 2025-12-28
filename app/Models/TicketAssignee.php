<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketAssignee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'role_title',
        'role_description',
    ];

    // --- Relations ---
    public function ticket() {
        return $this->belongsTo(Ticket::class, 'ticket_id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }
}