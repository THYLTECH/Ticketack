<?php

namespace App\Http\Controllers;

use App\Models\Attachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    /**
     * Remove the specified attachment from storage and database.
     */
    public function destroy(Attachment $attachment): RedirectResponse
    {
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
