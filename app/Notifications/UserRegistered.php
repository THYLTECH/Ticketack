<?php

// app/Notifications/UserRegistered.php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;

// Mails
use App\Mail\Auth\RegisteredEmail;

class UserRegistered extends Notification implements shouldQueue
{
    use Queueable;

    protected $type;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->type = 'user_registered';
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
            'title' => __("notifications.database.registered.title", ['app' => config('app.name')]),
            'message' => __("notifications.database.registered.message", ['app' => config('app.name')]),
            'action' => __("notifications.database.registered.action"),
            'action_url' => route('auth.login'),
        ];
    }
}
