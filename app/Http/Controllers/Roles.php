<?php

namespace App\Http\Controllers;

use App\Http\Requests\Roles\Store as RequestsStore;
use App\Http\Requests\Roles\Update as RequestsUpdate;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;

/**
 * Class Roles
 *
 * Controller for managing roles and their related data.
 *
 * @package App\Http\Controllers
 */
class Roles extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Role::class, 'role');
    }

    /**
     * Display a listing of the roles.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = Role::with('permissions')->withCount('users');

        if ($request->filled('search')) {
            $query->where('name', 'like', '%' . $request->input('search') . '%');
        }

        $query->orderByRaw("CASE WHEN name IN ('admin', 'solver', 'simple_user') THEN 0 ELSE 1 END")
            ->orderBy('name');

        $roles = $query->paginate($request->input('per_page', 10))->withQueryString();

        $roles->getCollection()->transform(function ($role) {
            $role->nbrOfUsers = $role->users_count;
            return $role;
        });

        return Inertia::render('roles/index', [
            'roles' => $roles,
            'filters' => $request->only('search'),
        ]);
    }

    /**
     * Show the form for creating a new role.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('roles/create', [
            'permissions' => Permission::all(),
            'usersWithoutRole' => User::with('avatar')->get()
        ]);
    }

    /**
     * Show the form for editing the specified role.
     *
     * @param Role $role
     * @return Response
     */
    public function edit(Role $role): Response
    {
        $usersWithoutRole = User::whereDoesntHave('roles', function ($query) use ($role) {
            $query->where('id', $role->id);
        })->with('avatar')->get();

        return Inertia::render('roles/edit', [
            'role' => $role->load('permissions', 'users.avatar'),
            'permissions' => Permission::all(),
            'usersWithoutRole' => $usersWithoutRole
        ]);
    }

    /**
     * Display the specified role.
     *
     * @param Role $role
     * @return Response
     */
    public function show(Role $role): Response
    {
        $usersWithoutRole = User::whereDoesntHave('roles', function ($query) use ($role) {
            $query->where('id', $role->id);
        })->with('avatar')->get();

        return Inertia::render('roles/show', [
            'role' => $role->load('permissions', 'users.avatar'),
            'permissions' => Permission::all(),
            'usersWithoutRole' => $usersWithoutRole
        ]);
    }

    /**
     * Store a newly created role in the database.
     *
     * @param RequestsStore $request
     * @return RedirectResponse
     */
    public function store(RequestsStore $request): RedirectResponse
    {
        $data = $request->validated();

        $role = Role::create($data);

        $permissions = collect(data_get($data, 'permissions', []))->pluck('id')->toArray();
        $role->syncPermissions($permissions);

        $users = collect(data_get($data, 'users', []))->pluck('id')->toArray();
        $role->users()->sync($users);

        return redirect()->route('roles.index')
            ->with(['success' => __('roles.flash.created')]);
    }

    /**
     * Update the specified role in the database.
     *
     * @param RequestsUpdate $request
     * @param Role $role
     * @return RedirectResponse
     */
    public function update(RequestsUpdate $request, Role $role): RedirectResponse
    {
        $data = $request->validated();

        $systemRoles = ['admin', 'solver', 'simple_user'];
        $isSystemRole = in_array($role->name, $systemRoles);

        if (!$isSystemRole) {
            $role->update($data);

            $permissions = collect(data_get($data, 'permissions', []))->pluck('id')->toArray();
            $role->syncPermissions($permissions);
        }

        $users = collect(data_get($data, 'users', []))->pluck('id')->toArray();

        if ($role->name === 'simple_user') {
            $existingUsers = $role->users()->pluck('id')->toArray();
            $users = array_unique(array_merge($users, $existingUsers));
        }

        $role->users()->sync($users);

        return redirect()->route('roles.show', ['role' => $role->id])
            ->with(['success' => __('roles.flash.updated')]);
    }

    /**
     * Remove the specified role from the database.
     *
     * @param Role $role
     * @return RedirectResponse
     */
    public function destroy(Role $role): RedirectResponse
    {
        $lockedRoles = ['admin', 'solver', 'simple_user'];

        if (in_array($role->name, $lockedRoles)) {
            return redirect()->route('roles.index')->with(['error' => [
                'title' => __('common.flash.error'),
                'description' => __('roles.flash.delete_locked')
            ]]);
        }

        if ($role->users()->count() > 0) {
            return redirect()->route('roles.index')->with(['error' => [
                'title' => __('common.flash.error'),
                'description' => __('roles.flash.delete_error')
            ]]);
        }

        $role->delete();

        return redirect()->route('roles.index')
            ->with(['success' => __('roles.flash.deleted')]);
    }
}
