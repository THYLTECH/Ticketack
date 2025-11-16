<?php

namespace App\Models;

use Illuminate\Notifications\DatabaseNotification as BaseNotification;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DatabaseNotification extends BaseNotification
{
    use HasFactory;
}
