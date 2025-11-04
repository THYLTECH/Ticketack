<?php

// app/Models/PasswordResetToken.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PasswordResetToken extends Model
{
    protected $table = 'password_reset_tokens';
    public $timestamps = false;
    protected $primaryKey = 'email';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = ['token', 'created_at'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function user() {
        return $this->hasOne(User::class, 'email', 'email');
    }
}
