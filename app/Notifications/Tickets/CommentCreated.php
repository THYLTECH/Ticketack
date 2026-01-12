<?php

namespace App\Notifications\Tickets;

use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\User;
use Illuminate\Mail\Mailable;

class CommentCreated extends BaseTicketNotification
{
    public TicketComment $comment;

    public function __construct(Ticket $ticket, TicketComment $comment)
    {
        parent::__construct($ticket);
        $this->comment = $comment;
    }

    protected function getType(): string
    {
        return 'ticket_comment_created';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\CommentCreated($notifiable, $this->ticket, $this->type);
    }
}
