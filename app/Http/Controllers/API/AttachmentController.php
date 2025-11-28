<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Support\Facades\Storage;

class AttachmentController extends Controller
{
    // Ce contrôleur peut être étendu à l'avenir pour gérer d'autres opérations liées aux pièces jointes. (ROLE ADMIN)

    /**
     * DELETE /api/attachments/{attachment}
     * Supprime définitivement une pièce jointe.
     */
    public function destroy(Attachment $attachment)
    {
        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }

        $attachment->delete();

        return response()->json(['message' => 'Attachment deleted successfully']);

    }
}
