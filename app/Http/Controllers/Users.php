<?php

// app/Http/Controllers/Users.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;

// Models
use Spatie\Permission\Models\Role;
use App\Models\User;
use App\Models\Attachment;

// Requests
use App\Http\Requests\Users\Store as RequestsStore;
use App\Http\Requests\Users\Update as RequestsUpdate;

// Notifications
use App\Notifications\UserRegistered as NotificationsUserRegistered;

/**
 * Class Users
 *
 * Controller for managing users and their related data.
 *
 * @package App\Http\Controllers
 */
class Users extends Controller
{
    public function __construct() {
        $this->authorizeResource(User::class, 'user');
    }

    /**
     * Display a listing of the users.
     *
     * @return Response
     */
    public function index(): Response {
        return Inertia::render('users/index', [
            'users' => User::with('roles')->paginate(10),
        ]);
    }

    /**
     * Show the form for creating a new user.
     *
     * @return Response
     */
    public function create(): Response {
        return Inertia::render('users/create', [
            'roles' => Role::whereNull('deleted_at')->orderBy('name')->get(),
        ]);
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param User $user
     * @return Response | RedirectResponse
     */
    public function edit(User $user): Response | RedirectResponse {
        return Inertia::render('users/edit', [
            'user' => $user->load('roles', 'avatar'),
            'roles' => Role::whereNull('deleted_at')->orderBy('name')->get(),
        ]);
    }

    /**
     * Display the specified user.
     *
     * @param User $user
     * @return Response | RedirectResponse
    */
    public function show(User $user): Response | RedirectResponse {
        return Inertia::render('users/show', [
            'user' => $user->load('roles', 'avatar'),
            'roles' => Role::all(),
        ]);
    }

    /**
     * Store a newly created user in database.
     *
     * @param RequestStore $request
     * @return RedirectResponse
     */
    public function store(RequestsStore $request): RedirectResponse {
        $data = $request->validated();

        // Generate a random password
        $plain_password = Str::random(12);
        $hashed_password = Hash::make($plain_password);
        $data['password'] = $hashed_password;

        // Set email verified attribute
        if ($data['email_verified']) {
            $data['email_verified_at'] = now();
        } else {
            $data['email_verified_at'] = null;
        }
        unset($data['email_verified']);

        // Create the user
        $user = User::create($data);

        // Assign roles
        if (isset($data['roles']) && is_array($data['roles'])) {
            $roles = Role::whereIn('id', $data['roles'])->get();
            $user->syncRoles($roles);
        }

        // Attach avatar
        if ($request->hasFile('avatar')) {
            $file = $request->file('avatar');
            $path = Storage::disk('public')->putFile("users/{$user->id}/avatars", $file);
            $attachment = Attachment::create([
                'file_name'      => $file->getClientOriginalName(),
                'file_path'      => $path,
                'mime_type'      => $file->getMimeType(),
                'file_extension' => $file->getClientOriginalExtension(),
                'file_size'      => $file->getSize(),
            ]);
            $user->avatar()->associate($attachment);
            $user->save();
        }

        Notification::send($user, new NotificationsUserRegistered($plain_password));
        return redirect()->route('users.index')->with(['success' => __('users.flash.created')]);
    }

    /**
     * Update the specified user in database.
     *
     * @param Request $request
     * @param User $user
     * @return RedirectResponse
     */
    public function update(RequestsUpdate $request, User $user): RedirectResponse {
        $data = $request->validated();
        unset($data['avatar']);

        if ($request->exists('avatar') && $request->avatar === null && $user->avatar) {
            // Delete existing avatar
            Storage::disk('public')->delete($user->avatar->file_path);
            $user->avatar->delete();
            $user->update(['attachment_avatar' => null]);

        } elseif ($request->hasFile('avatar')) {

            $file = $request->file('avatar');
            if ($user->avatar) {
                Storage::disk('public')->delete($user->avatar->file_path);
                $user->avatar->delete();
            }
            $path = Storage::disk('public')->putFile("users/{$user->id}/avatars", $file);
            $attachment = Attachment::create([
                'file_name'      => $file->getClientOriginalName(),
                'file_path'      => $path,
                'mime_type'      => $file->getMimeType(),
                'file_extension' => $file->getClientOriginalExtension(),
                'file_size'      => $file->getSize(),
            ]);
            $user->avatar()->associate($attachment);
            $user->save();
        }

        // Update email verified attribute
        if ($data['email_verified']) {
            $data['email_verified_at'] = now();
        } else {
            $data['email_verified_at'] = null;
        }
        unset($data['email_verified']);
        $user->update($data);

        // Update roles
        if (isset($data['roles']) && is_array($data['roles'])) {
            $roles = Role::whereIn('id', $data['roles'])->get();
            $user->syncRoles($roles);
        }
        return redirect()->route('users.index')->with(['success' => __('users.flash.updated')]);
    }

    /**
     * Remove the specified user from database.
     *
     * @param User $user
     * @return RedirectResponse
     */
    public function destroy(User $user): RedirectResponse {
        // avatar not deleted on soft delete
        /*
        if ($user->avatar) {
            Storage::disk('public')->delete($user->avatar->file_path);
            $user->avatar->delete();
        }
        */
        $user->delete();
        return redirect()->route('users.index')->with(['success' => __('users.flash.deleted')]);
    }
}
