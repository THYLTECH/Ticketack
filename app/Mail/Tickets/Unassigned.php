<?php

namespace App\Mail\Tickets;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;
use App\Models\Ticket;
use App\Models\User;

class Unassigned extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $ticket;
    protected $unassignedUser;
    protected $type;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Ticket $ticket, User $unassignedUser, string $type)
    {
        $this->user = $user;
        $this->ticket = $ticket;
        $this->unassignedUser = $unassignedUser;
        $this->type = $type;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            to: [new Address($this->user->email, $this->user->name ?? null)],
            subject: __('notifications.mail.' . $this->type . '.subject', ['app' => config('app.name')]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.tickets.' . $this->type,
            with: [
                'user' => $this->user,
                'ticket' => $this->ticket,
                'unassignedUser' => $this->unassignedUser,
                'type' => $this->type,
                'url' => route('tickets.show', $this->ticket->id),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

