<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'name',
        'timezone',
        'theme',
        'color_scheme',
        'phone',
        'email',
        'password',
        'language',
        'verification_token',
        'email_verified_at',
        'attachment_avatar',
    ];

    protected $with = ['avatar'];

    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function notificationPreferences(): HasMany
    {
        return $this->hasMany(NotificationPreference::class);
    }

    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class, 'author_id');
    }

    public function avatar(): BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'attachment_avatar');
    }

    public function routeNotificationForVonage(Notification $notification): string
    {
        return $this->phone;
    }

    public function passwordResetToken(): HasOne
    {
        return $this->hasOne(PasswordResetToken::class, 'email', 'email');
    }
}
