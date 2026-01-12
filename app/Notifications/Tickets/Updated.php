<?php

namespace App\Notifications\Tickets;

use App\Models\User;
use Illuminate\Mail\Mailable;

class Updated extends BaseTicketNotification
{
    protected function getType(): string
    {
        return 'ticket_updated';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\Updated($notifiable, $this->ticket, $this->type);
    }
}
