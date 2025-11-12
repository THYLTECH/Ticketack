<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class NotificationPreference extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'channel',
        'enabled',
    ];

    /**
     * Relations
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
