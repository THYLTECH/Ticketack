<?php

// app/Policies/Ticket.php

namespace App\Policies;

use App\Models\Ticket as ModelsTicket;
use App\Models\User;
use Illuminate\Auth\Access\Response;

/**
 * Policy class for managing permissions related to Ticket model.
 *
 * This class defines the authorization logic for various actions
 * that can be performed on Ticket instances.
 *
 * @package App\Policies
 */
class Ticket
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view tickets');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, ModelsTicket $ticket): bool
    {
        if ($user->hasRole(['admin', 'solver'])) {
            return true;
        }

        return $user->can('show tickets') && (
            $user->id === $ticket->author_id ||
            $ticket->assignees->contains('user_id', $user->id)
        );
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create tickets');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, ModelsTicket $ticket): bool
    {
        if ($user->hasRole(['admin', 'solver'])) {
            return $user->can('update tickets');
        }

        return $user->can('update tickets') && (
            $user->id === $ticket->author_id ||
            $ticket->assignees->contains('user_id', $user->id)
        );
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, ModelsTicket $ticket): bool
    {
        return $user->can('delete tickets');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, ModelsTicket $ticket): bool
    {
        return $user->can('restore tickets');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, ModelsTicket $ticket): bool
    {
        return $user->can('force delete tickets');
    }
}
