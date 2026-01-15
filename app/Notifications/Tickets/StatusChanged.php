<?php

namespace App\Notifications\Tickets;

use App\Models\Ticket;
use App\Models\TicketStatus;
use App\Models\User;
use Illuminate\Mail\Mailable;

class StatusChanged extends BaseTicketNotification
{
    public ?TicketStatus $oldStatus;
    public ?TicketStatus $newStatus;

    public function __construct(Ticket $ticket, ?TicketStatus $oldStatus = null, ?TicketStatus $newStatus = null)
    {
        parent::__construct($ticket);
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    protected function getType(): string
    {
        return 'ticket_status_changed';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\StatusChanged($notifiable, $this->ticket, $this->type);
    }

    protected function getSmsParams(): array
    {
        return array_merge(parent::getSmsParams(), [
            'status' => $this->ticket->status?->title ?? '',
        ]);
    }
}
