<?php

namespace App\Notifications\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Mail\Mailable;

class Unassigned extends BaseTicketNotification
{
    public User $unassignedUser;

    public function __construct(Ticket $ticket, User $unassignedUser)
    {
        parent::__construct($ticket);
        $this->unassignedUser = $unassignedUser;
    }

    protected function getType(): string
    {
        return 'ticket_unassigned';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\Unassigned($notifiable, $this->ticket, $this->unassignedUser, $this->type);
    }

    /**
     * Override to always include database channel.
     *
     * @return array<int, string>
     */
    public function via(User $notifiable): array
    {
        $channels = parent::via($notifiable);

        if (!in_array('database', $channels)) {
            $channels[] = 'database';
        }

        return $channels;
    }

    protected function getMessageParams(): array
    {
        return [
            'title' => $this->ticket->title,
            'user' => $this->unassignedUser->name,
        ];
    }

    protected function getSmsParams(): array
    {
        return array_merge(parent::getSmsParams(), [
            'user' => $this->unassignedUser->name,
        ]);
    }
}

