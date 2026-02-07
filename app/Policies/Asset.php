<?php

// app/Policies/Asset.php

namespace App\Policies;

use App\Models\Asset as ModelsAsset;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Policy class for managing permissions related to Asset model.
 *
 * This class defines the authorization logic for various actions
 * that can be performed on Asset instances.
 *
 * @package App\Policies
 */
class Asset
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view assets');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ModelsAsset $asset): bool
    {
        return $user->can('show assets');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create assets');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ModelsAsset $asset): bool
    {
        return $user->can('update assets');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ModelsAsset $asset): bool
    {
        return $user->can('delete assets');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ModelsAsset $asset): bool
    {
        return $user->can('restore assets');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ModelsAsset $asset): bool
    {
        return $user->can('force delete assets');
    }
}
