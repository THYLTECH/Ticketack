<?php

namespace App\Notifications\Tickets;

use App\Models\Ticket;
use App\Models\TicketPriority;
use App\Models\User;
use Illuminate\Mail\Mailable;

class PriorityChanged extends BaseTicketNotification
{
    public ?TicketPriority $oldPriority;
    public ?TicketPriority $newPriority;

    public function __construct(Ticket $ticket, ?TicketPriority $oldPriority = null, ?TicketPriority $newPriority = null)
    {
        parent::__construct($ticket);
        $this->oldPriority = $oldPriority;
        $this->newPriority = $newPriority;
    }

    protected function getType(): string
    {
        return 'ticket_priority_changed';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\PriorityChanged($notifiable, $this->ticket, $this->type);
    }

    protected function getSmsParams(): array
    {
        return array_merge(parent::getSmsParams(), [
            'priority' => $this->ticket->priority?->title ?? '',
        ]);
    }
}
