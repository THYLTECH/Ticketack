<?php

// app/Notifications/VerifyEmail.php

namespace App\Notifications;

use App\Mail\Auth\VerifyEmail as MailsVerifyEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;

class VerifyEmail extends Notification implements shouldQueue
{
    use Queueable;

    protected $type;
    protected $token;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $token)
    {
        $this->type = 'verify_email';
        $this->token = $token;
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
        return new MailsVerifyEmail($notifiable, $this->token);
    }
}
