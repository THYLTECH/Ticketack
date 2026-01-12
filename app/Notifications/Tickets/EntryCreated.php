<?php

namespace App\Notifications\Tickets;

use App\Models\Ticket;
use App\Models\TicketEntry;
use App\Models\User;
use Illuminate\Mail\Mailable;

class EntryCreated extends BaseTicketNotification
{
    public TicketEntry $entry;

    public function __construct(Ticket $ticket, TicketEntry $entry)
    {
        parent::__construct($ticket);
        $this->entry = $entry;
    }

    protected function getType(): string
    {
        return 'ticket_entry_created';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\EntryCreated($notifiable, $this->ticket, $this->type);
    }
}
