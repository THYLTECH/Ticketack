<?php

namespace App\Notifications;

use App\Helpers\NotificationPreferences;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\VonageMessage;
use Illuminate\Notifications\Notification;

class TicketUnassigned extends Notification
{
    use Queueable;

    protected $type;

    /**
     * Create a new notification instance.
     */
    public function __construct(
        public Ticket $ticket,
        public User $unassignedUser
    ) {
        $this->type = 'ticket_unassigned';
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
        $channels = !empty($preferences) ? $preferences : ['database'];

        // Always add the notification to the database.
        if (!in_array('database', $channels)) {
            $channels[] = 'database';
        }

        return $channels;
    }

    /**
     * Get the database representation of the notification
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => $this->type,
            'category' => NotificationPreferences::getCategoryForType($this->type) ?? 'tickets',
            'title' => __('notifications.ticket_unassigned.title'),
            'message' => __('notifications.ticket_unassigned.message', [
                'user' => $this->unassignedUser->name,
                'ticket' => $this->ticket->title,
                'ticket_id' => $this->ticket->id,
            ]),
            'action' => __('notifications.ticket_unassigned.action'),
            'action_url' => route('tickets.show', $this->ticket),
        ];
    }

    /**
     * Get the Vonage / SMS representation of the notification.
     */
    public function toVonage(object $notifiable): VonageMessage|bool
    {
        return (new VonageMessage)
            ->clientReference((string) $notifiable->id)
            ->content(__('notifications.ticket_unassigned.sms', [
                'user' => $this->unassignedUser->name,
                'ticket_id' => $this->ticket->id,
            ]));
    }
}

