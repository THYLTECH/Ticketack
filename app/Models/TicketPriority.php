<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TicketPriority extends Model
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
        'locked',
    ];

    // --- Relations ---
    public function tickets() {
        return $this->hasMany(Ticket::class, 'priority_id');
    }

}
