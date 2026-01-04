<?php

// app/Policies/User.php

namespace App\Policies;
use App\Models\User as ModelsUser;

/**
 * Policy class for managing permissions related to User model.
 *
 * This class defines the authorization logic for various actions
 * that can be performed on User instances.
 *
 * @package App\Policies
 */
class User
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(ModelsUser $user): bool
    {
        return $user->can('view users');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(ModelsUser $user): bool
    {
        return $user->can('show users');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(ModelsUser $user): bool
    {
        return $user->can('create users');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(ModelsUser $user): bool
    {
        return $user->can('update users');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(ModelsUser $user): bool
    {
        return $user->can('delete users');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(ModelsUser $user): bool
    {
        return $user->can('restore users');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(ModelsUser $user): bool
    {
        return $user->can('force delete users');
    }

}
