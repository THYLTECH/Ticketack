<?php

namespace App\Mail\Tickets;

use App\Models\Ticket;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Base class for ticket-related emails to reduce code duplication.
 */
abstract class BaseTicketMail extends Mailable
{
    use Queueable, SerializesModels;

    protected User $user;
    protected Ticket $ticket;
    protected string $type;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, Ticket $ticket, string $type)
    {
        $this->user = $user;
        $this->ticket = $ticket;
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
            with: $this->getContentData(),
        );
    }

    /**
     * Get the data for the email content.
     * Override in child classes to add extra data.
     */
    protected function getContentData(): array
    {
        return [
            'user' => $this->user,
            'ticket' => $this->ticket,
            'type' => $this->type,
            'url' => route('tickets.show', $this->ticket->id),
        ];
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}

