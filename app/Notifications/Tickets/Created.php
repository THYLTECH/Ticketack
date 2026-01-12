<?php

namespace App\Notifications\Tickets;

use App\Models\User;
use Illuminate\Mail\Mailable;

class Created extends BaseTicketNotification
{
    protected function getType(): string
    {
        return 'ticket_created';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\Created($notifiable, $this->ticket, $this->type);
    }
}
