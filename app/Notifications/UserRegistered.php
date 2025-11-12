<?php

// app/Notifications/UserRegistered.php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;

// Mails
use App\Mail\Auth\RegisteredEmail;

// Models
use App\Models\User;

class UserRegistered extends Notification implements shouldQueue
{
    use Queueable;

    protected $user;
    protected $type;

    /**
     * Create a new notification instance.
     */
    public function __construct(User $user)
    {
        $this->type = 'user_registered';
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    { 
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable) : Mailable
    {
        return new RegisteredEmail($notifiable);
    }

    /**
     * Get the database representation of the notification
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => __("notifications.sms.registered.title", ['app' => config('app.name')]),
            'message' => __("notifications.sms.registered.message", ['app' => config('app.name')]),
            'action' => __("notifications.sms.registered.action"),
            'action_url' => route('auth.login'),
        ];
    }
}
