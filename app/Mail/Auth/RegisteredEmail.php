<?php

// app\Mail\RegisteredEmail 

namespace App\Mail\Auth;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;

// Models
use App\Models\User;

class RegisteredEmail extends Mailable
{
    use Queueable, SerializesModels;

    protected $user;
    protected $plain_password;

    /**
     * Create a new message instance.
     */
    public function __construct(User $user, ?string $plain_password = null)
    {
        $this->user = $user;
        $this->plain_password = $plain_password;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: __('notifications.mail.registered.subject', ['app' => config('app.name')]),
            to: [new Address($this->user->email, $this->user->name ?? null)],
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.auth.registered',
            with: [
                'user' => $this->user,
                'url' => route('auth.login'),
                'plain_password' => $this->plain_password,
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
