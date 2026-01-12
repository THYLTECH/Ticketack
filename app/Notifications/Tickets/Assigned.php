<?php

namespace App\Notifications\Tickets;

use App\Models\User;
use Illuminate\Mail\Mailable;

class Assigned extends BaseTicketNotification
{
    protected function getType(): string
    {
        return 'ticket_assigned';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\Assigned($notifiable, $this->ticket, $this->type);
    }
}
