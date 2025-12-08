<?php


namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Attachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    /**
     * Show my profile
     *
     * Get the authenticated user's profile.
     */
    public function show(Request $request)
    {
        return response()->json(
            $request->user()->load(['roles', 'permissions', 'avatar'])
        );
    }

    /**
     * Modify my profile
     *
     * Update the authenticated user's profile information.
     */
    public function update(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'phone' => ['nullable', 'string', 'max:20'],
            'language' => ['sometimes', 'string', 'max:5'],
            'timezone' => ['sometimes', 'string', 'max:50'],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => $user->fresh(['avatar', 'roles']),
        ]);
    }

    /**
     * Change my password
     *
     * Update the authenticated user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json([
            'message' => 'Password updated successfully',
        ]);
    }

    /**
     * Delete my account
     *
     * Delete the authenticated user's account.
     */
    public function destroy(Request $request)
    {
        $user = $request->user();

        $user->delete();

        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Account deleted successfully',
        ]);
    }

    /**
     * Update my avatar
     *
     * Update the authenticated user's avatar.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updateAvatar(Request $request)
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
