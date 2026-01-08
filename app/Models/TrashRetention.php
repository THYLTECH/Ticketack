<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TrashRetention extends Model
{
    protected $fillable = ['type', 'days'];
}
