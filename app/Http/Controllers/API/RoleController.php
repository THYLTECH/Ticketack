<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    const PERM_VIEW = 'view roles';

    /**
     * List all roles.
     *
     * List all roles with permissions.
     */
    public function index()
    {
        if (!Gate::allows(self::PERM_VIEW) && !Gate::allows('create users')) {
            abort(403);
        }

        return response()->json(
            Role::with('permissions')->get()
        );
    }

    /**
     * Create a new role.
     *
     * Let you create a new role with permissions.
     */
    public function store(Request $request)
    {
        Gate::authorize('create roles');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:roles,name'],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => 'web'
        ]);

        if (!empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'message' => 'Role created successfully',
            'role' => $role->load('permissions'),
        ], 201);
    }

    /**
     * Show a specific role.
     *
     * Display a specific role with permissions.
     */
    public function show(Role $role)
    {
        Gate::authorize(self::PERM_VIEW);
        return response()->json($role->load('permissions'));
    }

    /**
     * Update a role.
     *
     * Update a specific role with permissions.
     */
    public function update(Request $request, Role $role)
    {
        Gate::authorize('update roles');

        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot edit Super Admin role'], 403);
        }

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255', Rule::unique('roles', 'name')->ignore($role->id)],
            'permissions' => ['array'],
            'permissions.*' => ['exists:permissions,name'],
        ]);

        if (isset($validated['name'])) {
            $role->update(['name' => $validated['name']]);
        }

        if (isset($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }

        return response()->json([
            'message' => 'Role updated successfully',
            'role' => $role->fresh('permissions'),
        ]);
    }

    /**
     * Delete a role.
     *
     * Delete a specific role.
     */
    public function destroy(Role $role)
    {
        Gate::authorize('delete roles');

        if ($role->name === 'Super Admin') {
            return response()->json(['message' => 'Cannot delete Super Admin role'], 403);
        }

        if ($role->users()->exists()) {
            return response()->json(['message' => 'Cannot delete role assigned to users'], 422);
        }

        $role->delete();

        return response()->json(['message' => 'Role deleted successfully']);
    }

    /**
     * List all available permissions.
     *
     * Used by the select component.
     * GET /api/permissions
     */
    public function permissions()
    {
        Gate::authorize(self::PERM_VIEW);
        return response()->json(Permission::all()->pluck('name'));
    }
}
