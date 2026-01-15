<?php

namespace App\Mail\Tickets;

class StatusChanged extends BaseTicketMail
{
    protected function getContentData(): array
    {
        return array_merge(parent::getContentData(), [
            'status' => $this->ticket->status,
        ]);
    }
}
