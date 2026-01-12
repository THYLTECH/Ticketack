<?php

namespace App\Mail\Tickets;

use App\Models\Ticket;
use App\Models\User;

class Unassigned extends BaseTicketMail
{
    protected User $unassignedUser;

    public function __construct(User $user, Ticket $ticket, User $unassignedUser, string $type)
    {
        parent::__construct($user, $ticket, $type);
        $this->unassignedUser = $unassignedUser;
    }

    protected function getContentData(): array
    {
        return array_merge(parent::getContentData(), [
            'unassignedUser' => $this->unassignedUser,
        ]);
    }
}

