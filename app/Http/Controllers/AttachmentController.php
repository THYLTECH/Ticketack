<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use App\Models\TicketAttachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    /**
     * Remove the specified attachment from storage and database.
     */
    public function destroy(Attachment $attachment): RedirectResponse
    {
        $user = auth()->user();

        if (!$user->hasRole('admin') && $attachment->user_id !== $user->id) {
            abort(403, "Vous ne pouvez pas supprimer ce fichier.");
        }

        TicketAttachment::where('attachment_id', $attachment->id)->get()->each(function ($link) {
            $link->delete();
        });
        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return back()->with(
            'success',
            __('tickets.pages.show.comments.notifications.attachment_deleted')
        );
    }
}
