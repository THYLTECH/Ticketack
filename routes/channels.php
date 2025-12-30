<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Ticket;

Broadcast::channel('ticket.{ticket}', function ($user, Ticket $ticket) {
    return $user->can('view', $ticket);
});
