<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\PasswordResetToken;

class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'verification_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relations
     */
    public function notificationPreferences()
    {
        return $this->hasMany(NotificationPreference::class);
    }

    // Mandatory for notification via sms
    public function routeNotificationForVonage(\Illuminate\Notifications\Notification $notification): string {
        return $this->phone;
    }

    /**
     * Custom methods
     */
    public function passwordResetToken() {
        return $this->hasOne(PasswordResetToken::class, 'email', 'email');
    }

    public function avatar(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(Attachment::class, 'attachment_avatar');
    }

}
