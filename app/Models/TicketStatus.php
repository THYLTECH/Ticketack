<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketStatus extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'title',
        'description',
        'sort_order',
        'color',
        'icon',
        'is_default',
        'is_closed',
    ];

    // --- Relations ---
    public function tickets() {
        return $this->hasMany(Ticket::class, 'status_id');
    }
}
