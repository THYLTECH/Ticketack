<?php

// app/Notifications/Example.php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\VonageMessage;
use App\Helpers\NotificationPreferences;

class Example extends Notification implements shouldQueue
{
    use Queueable;

    protected $type;

    /**
     * Create a new notification instance.
     */
    public function __construct()
    {
        $this->type = 'example';
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
        // Fetch preferences
        $preferences = $notifiable->notificationPreferences()
            ->where('type', $this->type)
            ->where('enabled', true)
            ->pluck('channel')
            ->toArray();

        // Fallback if preferences are not defined
        $channels = !empty($preferences) ? $preferences : ['mail'];

        // Always add the notification to the database.
        if (!in_array('database', $channels)) {
            $channels[] = 'database';
        }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        return new Mailable($notifiable);
    }

    /**
     * Get the database representation of the notification
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'category' => NotificationPreferences::getCategoryForType($this->type) ?? 'general',
            'title' => __("Example"),
            'message' => __("example"),
            'action' => __("example"),
            'action_url' => route('dashboard'),
        ];
    }

    /**
    * Get the Vonage / SMS representation of the notification.
    */
    public function toVonage(object $notifiable): VonageMessage | bool
    {
        return (new VonageMessage)
            ->clientReference((string) $notifiable->id)
            ->content(__(''));
    }
}
