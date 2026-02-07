<?php

namespace App\Policies;

use App\Models\TicketSchedule;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

/**
 * Policy class for managing permissions related to TicketSchedule model.
 * * Defines the authorization logic for planning and interventions.
 */
class TicketSchedulePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any models.
     * Linked to index() method in Schedules controller.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view planning');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, TicketSchedule $ticketSchedule): bool
    {
        return $user->can('view planning');
    }

    /**
     * Determine whether the user can create models.
     * Linked to store() method in Schedules controller.
     */
    public function create(User $user): bool
    {
        return $user->can('manage planning');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, TicketSchedule $ticketSchedule): bool
    {
        return $user->can('manage planning');
    }

    /**
     * Determine whether the user can delete the model.
     * Linked to destroy() method in Schedules controller.
     */
    public function delete(User $user, TicketSchedule $ticketSchedule): bool
    {
        return $user->can('manage planning');
    }
}
