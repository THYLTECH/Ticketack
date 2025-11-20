<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserAvatarController extends Controller
{
    /**
     * Update the authenticated user's avatar.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpeg,png,webp|max:2048',
        ]);

        /** @var \App\Models\User $user */
        $user = Auth::user();
        $file = $request->file('avatar');

        // Delete old avatar if exists
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar->file_path);
            $user->avatar->delete();
        }

        // Upload new file
        $path = Storage::disk('public')->putFile("users/{$user->id}/avatars", $file);

        // Create new attachment
        $attachment = Attachment::create([
            'file_name'      => $file->getClientOriginalName(),
            'file_path'      => $path,
            'mime_type'      => $file->getMimeType(),
            'file_extension' => $file->getClientOriginalExtension(),
            'file_size'      => $file->getSize(),
        ]);

        // Attach to user
        $user->attachment_avatar = $attachment->id;
        $user->save();

        return response()->json([
            'message' => 'Avatar updated',
            'avatar' => $attachment,
        ]);
    }
}
