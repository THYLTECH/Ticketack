<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * List users
     *
     * Display a listing of the users with filtering and sorting.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        Gate::authorize('view users');

        $query = User::query()
            ->select('id', 'name', 'email', 'phone', 'email_verified_at', 'attachment_avatar', 'created_at', 'language', 'timezone')
            ->with(['avatar', 'roles']);

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($request->filled('language')) {
            $query->where('language', $request->language);
        }

        if ($request->filled('timezone')) {
            $query->where('timezone', $request->timezone);
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortDir = $request->get('sort_dir', 'asc');
        $allowedSorts = ['id', 'name', 'email', 'created_at'];

        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'id';
        }

        if (!in_array($sortDir, ['asc', 'desc'])) {
            $sortDir = 'asc';
        }

        $query->orderBy($sortBy, $sortDir);

        return response()->json(
            $query->paginate(intval($request->get('per_page', 10)))
        );
    }

    /**
     * Create a new user
     *
     * Store a newly created user in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        Gate::authorize('create users');

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'email_verified' => 'boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        $data['password'] = Hash::make(Str::random(16));

        if ($request->boolean('email_verified')) {
            $data['email_verified_at'] = now();
        }

        $user = User::create($data);

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user->load(['avatar', 'roles']),
        ], 201);
    }

    /**
     * Show the specified user
     *
     * Display the specified user.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(User $user)
    {
        Gate::authorize('view users');

        return response()->json(
            $user->load(['avatar', 'roles', 'permissions'])
        );
    }

    /**
     * Update the specified user
     *
     * Update the specified user in storage.
     *
     * @param \Illuminate\Http\Request $request
     * @param \App\Models\User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, User $user)
    {
        Gate::authorize('update users');

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'email_verified' => 'boolean',
            'roles' => 'array',
            'roles.*' => 'exists:roles,name',
        ]);

        $user->fill($data);

        if ($request->has('email_verified')) {
            $user->email_verified_at = $request->boolean('email_verified') ? now() : null;
        }

        $user->save();

        if ($request->has('roles')) {
            $user->syncRoles($request->roles);
        }

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user->fresh(['avatar', 'roles']),
        ]);
    }

    /**
     * Delete the specified user
     *
     * Remove the specified user from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy(User $user)
    {
        Gate::authorize('delete users');

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
