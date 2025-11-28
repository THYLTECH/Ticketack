<?php

// app/Policies/Role.php

namespace App\Policies;

use Spatie\Permission\Models\Role as ModelsRole;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Policy class for managing permissions related to Role model.
 * 
 * This class defines the authorization logic for various actions
 * that can be performed on Role instances.
 * 
 * @package App\Policies
 */
class Role
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view roles');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ModelsRole $role): bool
    {
        return $user->can('show roles');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create roles');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ModelsRole $role): bool
    {
        return $user->can('edit roles');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ModelsRole $role): bool
    {
        return $user->can('delete roles');
    }
}
