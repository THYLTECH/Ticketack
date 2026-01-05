<?php

namespace App\Http\Controllers\Tickets;

use App\Events\CommentPosted;
use App\Http\Controllers\Controller;
use App\Http\Requests\Tickets\Comments\Store as RequestStore;
use App\Models\Attachment;
use App\Models\Ticket;
use App\Models\TicketComment;
use App\Models\TicketCommentAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class Comments extends Controller
{
    /**
     * Store a newly created comment in storage.
     *
     * @param RequestStore $request
     * @param Ticket $ticket
     * @return RedirectResponse
     * @throws Throwable
     */
    public function store(RequestStore $request, Ticket $ticket): RedirectResponse
    {
        $this->authorize('view', $ticket);

        return DB::transaction(function () use ($request, $ticket) {
            $comment = $ticket->comments()->create([
                'user_id' => $request->user()->id,
                'content' => $request->validated('content') ?? '',
            ]);

            if ($request->hasFile('attachments')) {
                $this->handleAttachments($request->file('attachments'), $ticket, $comment);
            }

            $ticket->touch();
            CommentPosted::dispatch($comment);

            return redirect()->back();
        });
    }

    /**
     * Update the specified comment in storage.
     *
     * @param Request $request
     * @param Ticket $ticket
     * @param TicketComment $comment
     * @return RedirectResponse
     * @throws Throwable
     */
    public function update(Request $request, Ticket $ticket, TicketComment $comment): RedirectResponse
    {
        if ($comment->user_id !== $request->user()->id) {
            abort(403);
        }

        $validated = $request->validate([
            'content' => 'required|string',
        ]);

        return DB::transaction(function () use ($request, $ticket, $comment, $validated) {
            $comment->update(['content' => $validated['content']]);

            if ($request->hasFile('attachments')) {
                $this->handleAttachments($request->file('attachments'), $ticket, $comment);
            }

            $ticket->touch();
            CommentPosted::dispatch($comment->load(['user.avatar', 'attachments']));

            return redirect()->back();
        });
    }

    /**
     * Remove the specified comment from storage.
     *
     * @param Request $request
     * @param TicketComment $comment
     * @return RedirectResponse
     * @throws Throwable
     */
    public function destroy(Request $request, Ticket $ticket, TicketComment $comment): RedirectResponse
    {
        if ($comment->user_id !== $request->user()->id) {
            abort(403);
        }

        return DB::transaction(function () use ($comment) {
            foreach ($comment->attachments as $attachment) {
                if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
                    Storage::disk('public')->delete($attachment->file_path);
                }
                $attachment->delete();
            }

            $comment->delete();

            return redirect()->back();
        });
    }

    /**
     * Handle file attachments for a comment.
     *
     * @param array $files
     * @param Ticket $ticket
     * @param TicketComment $comment
     * @return void
     */
    private function handleAttachments(array $files, Ticket $ticket, TicketComment $comment): void
    {
        foreach ($files as $file) {
            $directory = "tickets/$ticket->id/comments/$comment->id";
            $extension = $file->getClientOriginalExtension();
            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);

            $storageName = Str::slug($originalName) . '_' . Str::random(8) . '.' . $extension;
            $path = $file->storeAs($directory, $storageName, 'public');

            $attachment = Attachment::create([
                'file_name'      => $file->getClientOriginalName(),
                'title'          => $file->getClientOriginalName(),
                'file_path'      => $path,
                'mime_type'      => $file->getMimeType(),
                'file_extension' => $extension,
                'file_size'      => $file->getSize(),
            ]);

            TicketCommentAttachment::create([
                'ticket_comment_id' => $comment->id,
                'attachment_id'     => $attachment->id,
            ]);
        }
    }
}
