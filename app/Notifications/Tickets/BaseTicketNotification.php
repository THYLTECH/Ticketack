<?php

namespace App\Notifications\Tickets;

use App\Helpers\NotificationPreferences;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Notifications\Messages\VonageMessage;
use Illuminate\Notifications\Notification;

/**
 * Base class for ticket notifications to reduce code duplication.
 */
abstract class BaseTicketNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected string $type;
    public Ticket $ticket;

    /**
     * Get the notification type identifier.
     */
    abstract protected function getType(): string;

    /**
     * Get the Mailable class for this notification.
     */
    abstract protected function getMailable(User $notifiable): Mailable;

    /**
     * Create a new notification instance.
     */
    public function __construct(Ticket $ticket)
    {
        $this->ticket = $ticket;
        $this->type = $this->getType();
    }

    /**
     * Get the notification's database type.
     */
    public function databaseType(User $notifiable): string
    {
        return $this->type;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        $preferences = $notifiable->notificationPreferences()
            ->where('type', $this->type)
            ->where('enabled', true)
            ->pluck('channel')
            ->toArray();

        return !empty($preferences) ? $preferences : ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(User $notifiable): Mailable
    {
        return $this->getMailable($notifiable);
    }

    /**
     * Get the database representation of the notification.
     */
    public function toDatabase(User $notifiable): array
    {
        return [
            'type' => $this->type,
            'category' => NotificationPreferences::getCategoryForType($this->type) ?? 'tickets',
            'title' => __('notifications.database.' . $this->type . '.title'),
            'message' => __('notifications.database.' . $this->type . '.message', $this->getMessageParams()),
            'action' => __('notifications.database.' . $this->type . '.action'),
            'action_url' => route('tickets.show', $this->ticket->id),
        ];
    }

    /**
     * Get the Vonage / SMS representation of the notification.
     */
    public function toVonage(User $notifiable): VonageMessage
    {
        return (new VonageMessage())
            ->clientReference((string) $notifiable->id)
            ->content(__('notifications.sms.' . $this->type . '.message', $this->getSmsParams()));
    }

    /**
     * Get parameters for database message translation.
     * Override in child classes to add extra params.
     */
    protected function getMessageParams(): array
    {
        return ['title' => $this->ticket->title];
    }

    /**
     * Get parameters for SMS message translation.
     * Override in child classes to add extra params.
     */
    protected function getSmsParams(): array
    {
        return [
            'title' => $this->ticket->title,
            'app' => config('app.name'),
            'url' => route('tickets.show', $this->ticket->id),
        ];
    }
}

