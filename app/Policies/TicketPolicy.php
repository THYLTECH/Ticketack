<?php

namespace App\Policies;

use App\Models\Ticket;
use App\Models\User;

class TicketPolicy
{
    /**
     * Determine whether the user can view the ticket.
     * * @param User $user
     * @param Ticket $ticket
     * @return bool
     */
    public function view(User $user, Ticket $ticket): bool
    {
        return $user->id === $ticket->author_id
            || $user->hasPermissionTo('view tickets');
    }
}
