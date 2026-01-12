<?php

namespace App\Notifications\Tickets;

use App\Models\Ticket;
use App\Models\TicketSchedule;
use App\Models\User;
use Illuminate\Mail\Mailable;

class ScheduleCreated extends BaseTicketNotification
{
    public TicketSchedule $schedule;

    public function __construct(Ticket $ticket, TicketSchedule $schedule)
    {
        parent::__construct($ticket);
        $this->schedule = $schedule;
    }

    protected function getType(): string
    {
        return 'ticket_schedule_created';
    }

    protected function getMailable(User $notifiable): Mailable
    {
        return new \App\Mail\Tickets\ScheduleCreated($notifiable, $this->ticket, $this->type);
    }
}
