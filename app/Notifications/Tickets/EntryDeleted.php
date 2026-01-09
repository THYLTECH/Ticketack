<?php

// app/Notifications/EntryDeleted.php

namespace App\Notifications\Tickets;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\VonageMessage;
use App\Helpers\NotificationPreferences;

// Models
use App\Models\Ticket;

class EntryDeleted extends Notification implements shouldQueue
{
    use Queueable;

    protected $type;
    protected $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->type = 'ticket_entry_deleted';
        $this->ticket = $ticket;
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
        // if (!in_array('database', $channels)) {
        //     $channels[] = 'database';
        // }

        return $channels;
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): Mailable
    {
        return new \App\Mail\Tickets\EntryDeleted($notifiable, $this->ticket, $this->type);
    }

    /**
     * Get the database representation of the notification
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'title' => __('notifications.database.' . $this->type . '.title'),
            'message' => __("notifications.database." . $this->type . ".message", ['title' => $this->ticket->title]),
            'action' => __("notifications.database." . $this->type . ".action"),
            'action_url' => route('tickets.show', $this->ticket->id),
        ];
    }

    /**
    * Get the Vonage / SMS representation of the notification.
    */
    public function toVonage(object $notifiable): VonageMessage | bool
    {
        return (new VonageMessage)
            ->clientReference((string) $notifiable->id)
            ->content(__('notifications.sms.' . $this->type . '.message', [
                'title' => $this->ticket->title,
                'app' => config('app.name'),
                'url' => route('tickets.show', $this->ticket->id),
            ]));
    }
}
