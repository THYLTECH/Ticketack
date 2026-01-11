<?php

namespace App\Notifications\Tickets;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification as BaseNotification;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\VonageMessage;
use App\Models\Ticket;
use App\Models\User;
use App\Helpers\NotificationPreferences;

class Unassigned extends BaseNotification implements ShouldQueue
{
    use Queueable;

    protected string $type;
    protected Ticket $ticket;
    protected User $unassignedUser;

    public function __construct(Ticket $ticket, User $unassignedUser)
    {
        $this->type = 'ticket_unassigned';
        $this->ticket = $ticket;
        $this->unassignedUser = $unassignedUser;
    }

    public function databaseType(User $notifiable): string
    {
        return $this->type;
    }

    /**
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        $preferences = $notifiable->notificationPreferences()
            ->where('type', $this->type)
            ->where('enabled', true)
            ->pluck('channel')
            ->toArray();

        $channels = !empty($preferences) ? $preferences : ['mail', 'database'];

        if (!in_array('database', $channels)) {
            $channels[] = 'database';
        }

        return $channels;
    }

    public function toMail(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\Unassigned($notifiable, $this->ticket, $this->unassignedUser, $this->type);
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(User $notifiable): array
    {
        return [
            'type' => $this->type,
            'category' => NotificationPreferences::getCategoryForType($this->type) ?? 'tickets',
            'title' => __('notifications.database.' . $this->type . '.title'),
            'message' => __("notifications.database." . $this->type . ".message", [
                'title' => $this->ticket->title,
                'user' => $this->unassignedUser->name,
            ]),
            'action' => __("notifications.database." . $this->type . ".action"),
            'action_url' => route('tickets.show', $this->ticket->id),
        ];
    }

    public function toVonage(User $notifiable): VonageMessage | bool
    {
        return (new VonageMessage)
            ->clientReference((string) $notifiable->id)
            ->content(__('notifications.sms.' . $this->type . '.message', [
                'title' => $this->ticket->title,
                'user' => $this->unassignedUser->name,
                'app' => config('app.name'),
                'url' => route('tickets.show', $this->ticket->id),
            ]));
    }
}

