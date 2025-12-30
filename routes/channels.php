<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Ticket;

Broadcast::channel('ticket.{ticketId}', function ($user, $ticketId) {
    return $user->can('view', Ticket::findOrFail($ticketId));
});
