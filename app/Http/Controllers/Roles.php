<?php

// app/Http/Controllers/Roles.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

// Models
use App\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

// Requests
use App\Http\Requests\Roles\Store as RequestsStore;
use App\Http\Requests\Roles\Update as RequestsUpdate;

/**
 * Class Roles
 *
 * Controller for managing roles and their related data.
 *
 * @package App\Http\Controllers
 */
class Roles extends Controller
{

    public function __construct() {
        $this->authorizeResource(Role::class, 'role');
    }

    /**
     * Display a listing of the roles.
     *
     * @return Response
     */
    public function index(): Response {
        // add user_length to roles
        $roles = Role::all()->load('permissions');
        foreach ($roles as $role) {
            $role->nbrOfUsers = $role->users()->count();
        }
        return Inertia::render('roles/index', ['roles' => $roles]);
    }

    /**
     * Show the form for creating a new role.
     *
     * @return Response
     */
    public function create(): Response {
        return Inertia::render('roles/create', ['permissions' => Permission::all(), 'usersWithoutRole' => User::all()]);
    }

    /**
     * Show the form for editing the specified role.
     *
     * @param Role $role
     * @return Response | RedirectResponse
     */
    public function edit(Role $role): Response | RedirectResponse {
        // Users who don't have this role
        $usersWithoutRole = User::whereDoesntHave('roles', function ($query) use ($role) {
            $query->where('id', $role->id);
        })->get();

        return Inertia::render('roles/edit', ['role' => $role->load('permissions', 'users'), 'permissions' => Permission::all(), 'usersWithoutRole' => $usersWithoutRole]);
    }

    /**
     * Display the specified role.
     *
     * @param Role $role
     * @return Response | RedirectResponse
    */
    public function show(Role $role): Response | RedirectResponse {
        // Users who don't have this role
        $usersWithoutRole = User::whereDoesntHave('roles', function ($query) use ($role) {
            $query->where('id', $role->id);
        })->get();

        return Inertia::render('roles/show', ['role' => $role->load('permissions', 'users'), 'permissions' => Permission::all(), 'usersWithoutRole' => $usersWithoutRole]);
    }

    /**
     * Store a newly created role in database.
     *
     * @param RequestsStore $request
     * @return RedirectResponse
     */
    public function store(RequestsStore $request): RedirectResponse {
        $data = $request->validated();

        // Create role
        $role = Role::create($data);
        // Sync permissions
        $permissions = collect(data_get($data, 'permissions', []))->pluck('id')->toArray();
        $role->syncPermissions($permissions);
        // Sync users
        $users = collect(data_get($data, 'users', []))->pluck('id')->toArray();
        $role->users()->sync($users);

        return redirect()->route('roles.show', ['role' => $role->id])->with(['success' => __('roles.flash.created')]);
    }

    /**
     * Update the specified role in database.
     *
     * @param Request $request
     * @param Role $role
     * @return RedirectResponse
     */
    public function update(RequestsUpdate $request, Role $role): RedirectResponse {
        $data = $request->validated();

        // Update role details
        $role->update($data);
        // Sync permissions
        $permissions = collect(data_get($data, 'permissions', []))->pluck('id')->toArray();
        $role->syncPermissions($permissions);
        // Sync users
        $users = collect(data_get($data, 'users', []))->pluck('id')->toArray();
        $role->users()->sync($users);

        return redirect()->route('roles.show', ['role' => $role->id])->with(['success' => __('roles.flash.updated')]);
    }

    /**
     * Remove the specified role from database.
     *
     * @param Role $role
     * @return RedirectResponse
     */
    public function destroy(Role $role): RedirectResponse {

        $lockedRoles = ['admin', 'solver', 'simple_user'];
        if (in_array($role->name, $lockedRoles)) {
            return redirect()->route('roles.index')->with(['error' => [
                'title' => __('common.flash.error'),
                'description' => __('roles.flash.delete_locked')
            ]]);
        }

        $users_count = $role->users()->count();
        if ($users_count > 0) {
            return redirect()->route('roles.index')->with(['error' => [
//                'title' => __('common.flash.error'),
//                'description' => __('roles.flash.delete_error')
                'title' => __('common.flash.error'),
                'description' => __('roles.flash.delete_error')
            ]]);
        }

        $role->delete();

//        return redirect()->route('roles.index')->with(['success' => __('roles.flash.deleted')]);
        return redirect()->route('roles.index')->with(['success' => __('roles.flash.deleted')]);
    }
}
