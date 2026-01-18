<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\Store as RequestsStore;
use App\Http\Requests\Users\Update as RequestsUpdate;
use App\Models\Attachment;
use App\Models\User;
use App\Notifications\UserRegistered as NotificationsUserRegistered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class Users extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(User::class, 'user');
    }

    public function index(Request $request): Response
    {
        $query = User::with(['roles', 'avatar'])->withCount('roles');

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($request->filled('role')) {
            $roleId = $request->input('role');
            $query->whereHas('roles', function ($q) use ($roleId) {
                $q->where('id', $roleId);
            });
        }

        $sort = $request->input('sort');
        $direction = $request->input('direction', 'desc');

        if ($sort) {
            $query->orderBy($sort, $direction);
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 10);
        $users = $query->paginate($perPage)->withQueryString();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role']),
            'roles' => Role::orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('users/create', [
            'roles' => Role::whereNull('deleted_at')->orderBy('name')->get(),
        ]);
    }

    public function edit(User $user): Response
    {
        return Inertia::render('users/edit', [
            'user' => $user->load('roles', 'avatar'),
            'roles' => Role::whereNull('deleted_at')->orderBy('name')->get(),
        ]);
    }

    public function show(User $user): Response
    {
        return Inertia::render('users/show', [
            'user' => $user->load('roles', 'avatar'),
            'roles' => Role::all(),
        ]);
    }

    public function store(RequestsStore $request): RedirectResponse
    {
        $data = $request->validated();

        $plain_password = Str::random(12);
        $data['password'] = Hash::make($plain_password);

        $data['email_verified_at'] = $data['email_verified'] ? now() : null;
        unset($data['email_verified']);

        $user = User::create($data);

        if (isset($data['roles']) && is_array($data['roles'])) {
            $roles = Role::whereIn('id', $data['roles'])->get();
            $user->syncRoles($roles);
        }

        $user->assignRole('simple_user');

        if ($request->hasFile('avatar')) {
            $this->handleAvatarUpload($user, $request->file('avatar'));
        }

        Notification::send($user, new NotificationsUserRegistered($plain_password));

        return redirect()->route('users.index')->with(['success' => __('users.flash.created')]);
    }

    public function update(RequestsUpdate $request, User $user): RedirectResponse
    {
        $data = $request->validated();
        unset($data['avatar']);

        if ($request->exists('avatar') && $request->avatar === null) {
            $this->deleteUserAvatar($user);
        } elseif ($request->hasFile('avatar')) {
            $this->handleAvatarUpload($user, $request->file('avatar'));
        }

        $data['email_verified_at'] = $data['email_verified'] ? now() : null;
        unset($data['email_verified']);

        $roles = $data['roles'] ?? null;
        unset($data['roles']);

        $user->update($data);

        if ($roles !== null && is_array($roles)) {
            $roleModels = Role::whereIn('id', $roles)->get();
            $user->syncRoles($roleModels);
        }

        $user->assignRole('simple_user');

        return redirect()->route('users.index')->with(['success' => __('users.flash.updated')]);
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->back()->with(['error' => [
                'title' => __('common.flash.error'),
                'description' => "You cannot delete your own account."
            ]]);
        }

        $user->delete();

        return redirect()->route('users.index')->with(['success' => __('users.flash.deleted')]);
    }

    public function restore(User $user): RedirectResponse
    {
        $this->authorize('restore', $user);

        $user->restore();

        return redirect()->back()->with(['success' => __('users.flash.restored')]);
    }

    public function forceDelete(User $user): RedirectResponse
    {
        $this->authorize('forceDelete', $user);

        $this->deleteUserAvatar($user);

        $user->forceDelete();

        return redirect()->route('users.index')->with(['success' => __('users.flash.forced_deleted')]);
    }

    private function handleAvatarUpload(User $user, UploadedFile $file): void
    {
        $this->deleteUserAvatar($user);

        $path = Storage::disk('public')->putFile("users/$user->id/avatars", $file);

        $attachment = Attachment::create([
            'file_name' => $file->getClientOriginalName(),
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'file_extension' => $file->getClientOriginalExtension(),
            'file_size' => $file->getSize(),
        ]);

        $user->avatar()->associate($attachment);
        $user->save();
    }

    private function deleteUserAvatar(User $user): void
    {
        if ($user->avatar) {
            if ($user->avatar->file_path && Storage::disk('public')->exists($user->avatar->file_path)) {
                Storage::disk('public')->delete($user->avatar->file_path);
            }
            $user->avatar->delete();
            $user->update(['attachment_avatar' => null]);
        }
    }
}
