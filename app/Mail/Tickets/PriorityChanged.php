<?php

namespace App\Mail\Tickets;

class PriorityChanged extends BaseTicketMail
{
    protected function getContentData(): array
    {
        return array_merge(parent::getContentData(), [
            'priority' => $this->ticket->priority,
        ]);
    }
}
