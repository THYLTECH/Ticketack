<?php

// app/Http/Controllers/Roles.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

// Models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

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
        // $this->authorizeResource(Role::class, 'role');
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
        return Inertia::render('roles/create', ['permissions' => Permission::all()]);
    }

    /**
     * Show the form for editing the specified role.
     * 
     * @param Role $role
     * @return Response | RedirectResponse
     */
    public function edit(Role $role): Response | RedirectResponse {
        return Inertia::render('roles/edit', ['role' => $role, 'permissions' => Permission::all()]);
    }

    /**
     * Display the specified role.
     * 
     * @param Role $role
     * @return Response | RedirectResponse
     */
    public function show(Role $role): Response | RedirectResponse {
        return Inertia::render('roles/show', ['role' => $role, 'permissions' => Permission::all()]);
    }

    /**
     * Store a newly created role in database.
     * 
     * @param RequestsStore $request
     * @return RedirectResponse
     */
    public function store(RequestsStore $request): RedirectResponse {
        $data = $request->all();

        $role = Role::create($data);
        $role->syncPermissions($data['permissions']);

        return redirect()->route('roles.index')->with(['success' => __('Role created successfully.')]);
    }

    /**
     * Update the specified role in database.
     * 
     * @param Request $request
     * @param Role $role
     * @return RedirectResponse
     */
    public function update(RequestsUpdate $request, Role $role): RedirectResponse {    
        $data = $request->all();

        $role->update($data);
        $role->syncPermissions($data['permissions']);

        return redirect()->route('roles.index')->with(['success' => __('Role updated successfully.')]);
    }

    /**
     * Remove the specified role from database.
     * 
     * @param Role $role
     * @return RedirectResponse
     */
    public function destroy(Role $role): RedirectResponse {
        $role->delete();

        return redirect()->route('roles.index')->with(['success' => __('Role deleted successfully.')]);
    }
}
