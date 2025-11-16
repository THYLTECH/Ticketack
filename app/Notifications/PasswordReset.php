<?php

// app/Notifications/PasswordReset.php

namespace App\Notifications;

use App\Mail\Auth\PasswordResetMail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;

class PasswordReset extends Notification implements shouldQueue
{
    use Queueable;

    protected $type;
    protected $plainToken;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $plainToken)
    {
        $this->type = 'password_reset';
        $this->plainToken = $plainToken;
    }

    /**
    * Get the notification's database type.
    */
    public function databaseType(object $notifiable): string
    {
        return $this->type;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    { 
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        return new PasswordResetMail($notifiable, $this->plainToken);
    }
}
