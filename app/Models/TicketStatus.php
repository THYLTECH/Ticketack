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
        'is_default',
        'is_closed',
    ];

    protected $appends = [
        'progress',
    ];


    // --- Relations ---
    public function tickets() {
        return $this->hasMany(Ticket::class, 'status_id');
    }

    // --- Accessors ---
    public function getProgressAttribute() {
        // return a value between 0 and 100 based on the sort_order

        $maxSortOrder = TicketStatus::max('sort_order');
        if ($maxSortOrder == 0) {
            return 0;
        }

        return intval((($this->sort_order + 1) / ($maxSortOrder + 1)) * 100);
    }
}
