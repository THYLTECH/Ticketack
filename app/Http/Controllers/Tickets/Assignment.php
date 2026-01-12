<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketAssignee;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use Exception;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;
use Inertia\Response;
use Log;

class Assignment extends Controller
{
    /**
     * Display the ticket assignment dashboard
     */
    public function index(Request $request): Response|RedirectResponse
    {
        try {
            if (!$request->user()->can('be assigned tickets')) {
                return redirect()->route('dashboard')
                    ->with('error', 'Vous n\'avez pas la permission d\'accéder à cette page.');
            }

            $canAssign = $request->user()->can('assign tickets');
            $canBeAssigned = $request->user()->can('be assigned tickets');

            $filters = [
                'search' => $request->get('search'),
                'priority' => $request->get('priority'),
                'status' => $request->get('status'),
                'category' => $request->get('category'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
            ];

            $query = Ticket::whereDoesntHave('assignees')
                ->whereNull('deleted_at')
                ->with(['user', 'priority', 'status', 'category', 'asset']);

            if ($filters['search']) {
                $query->where(function ($q) use ($filters) {
                    $q->where('title', 'like', '%' . $filters['search'] . '%')
                      ->orWhere('description', 'like', '%' . $filters['search'] . '%');
                });
            }

            if ($filters['priority'] && $filters['priority'] !== 'all') {
                $query->where('priority_id', $filters['priority']);
            }

            if ($filters['status'] && $filters['status'] !== 'all') {
                $query->where('status_id', $filters['status']);
            }

            if ($filters['category'] && $filters['category'] !== 'all') {
                $query->where('category_id', $filters['category']);
            }

            if ($filters['date_from'] && $filters['date_to']) {
                $query->whereBetween('created_at', [
                    $filters['date_from'] . ' 00:00:00',
                    $filters['date_to'] . ' 23:59:59',
                ]);
            }

            $allTickets = $query->get();

            /**
             * Sort tickets by priority (DESC) then by creation date (ASC)
             * This ensures high-priority tickets appear first, with the oldest tickets
             * prioritized within each priority level
             */
            $sortedTickets = $allTickets->sort(function ($a, $b) {
                $aPriority = $a->priority ? $a->priority->sort_order : 0;
                $bPriority = $b->priority ? $b->priority->sort_order : 0;

                if ($aPriority !== $bPriority) {
                    return $bPriority <=> $aPriority;
                }

                return $a->created_at <=> $b->created_at;
            })->values();

            $perPage = 15;
            $currentPage = $request->get('page', 1);
            $total = $sortedTickets->count();

            $items = $sortedTickets->forPage($currentPage, $perPage)->values();

            $unassignedTickets = new LengthAwarePaginator(
                $items,
                $total,
                $perPage,
                $currentPage,
                ['path' => $request->url(), 'query' => $request->query()]
            );

            $totalUnassigned = Ticket::whereDoesntHave('assignees')->whereNull('deleted_at')->count();

            $topPriorities = TicketPriority::orderBy('sort_order', 'desc')->take(4)->get();

            $priorityStats = [];
            foreach ($topPriorities as $priority) {
                $priorityStats[] = [
                    'id' => $priority->id,
                    'title' => $priority->title,
                    'color' => $priority->color,
                    'sort_order' => $priority->sort_order,
                    'count' => Ticket::whereDoesntHave('assignees')
                        ->whereNull('deleted_at')
                        ->where('priority_id', $priority->id)
                        ->count(),
                ];
            }

            $stats = [
                'total_unassigned' => $totalUnassigned,
                'priority_stats' => $priorityStats,
                'oldest_unassigned_days' => $totalUnassigned > 0
                    ? (int) floor(Ticket::whereDoesntHave('assignees')->whereNull('deleted_at')
                        ->oldest('created_at')->first()->created_at->diffInDays(now()))
                    : 0,
            ];

            $assignableUsers = User::permission('be assigned tickets')
                ->select('id', 'name', 'email')
                ->orderBy('name')
                ->get();

            $priorities = TicketPriority::orderBy('sort_order', 'desc')->get();
            $statuses = TicketStatus::all();
            $categories = TicketCategory::all();

            return Inertia::render('tickets/assignment', [
                'tickets' => $unassignedTickets,
                'stats' => $stats,
                'assignableUsers' => $assignableUsers,
                'canAssign' => $canAssign,
                'canBeAssigned' => $canBeAssigned,
                'filters' => $filters,
                'priorities' => $priorities,
                'statuses' => $statuses,
                'categories' => $categories,
            ]);
        } catch (Exception $e) {
            Log::error('Assignment controller error: ' . $e->getMessage(), [
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);

            return redirect()->route('dashboard')
                ->with('error', 'An error occurred while loading the ticket assignment dashboard.');
        }
    }

    /**
     * Assign a ticket to one or multiple users
     */
    public function assign(Request $request, Ticket $ticket)
    {
        $this->authorize('assign', $ticket);

        $validated = $request->validate([
            'user_id' => 'sometimes|exists:users,id',
            'user_ids' => 'sometimes|array',
            'user_ids.*' => 'exists:users,id',
        ]);

        $userIds = [];
        if (isset($validated['user_ids'])) {
            $userIds = $validated['user_ids'];
        } elseif (isset($validated['user_id'])) {
            $userIds = [$validated['user_id']];
        }

        if (empty($userIds)) {
            return back()->with('error', __('tickets.assignment.no_users_selected'));
        }

        $assignedCount = 0;
        $alreadyAssignedCount = 0;
        $cannotBeAssignedCount = 0;

        foreach ($userIds as $userId) {
            $targetUser = User::find($userId);

            if (!$targetUser) {
                continue;
            }

            if (!$targetUser->can('be assigned tickets')) {
                $cannotBeAssignedCount++;
                continue;
            }

            if ($ticket->assignees()->where('user_id', $userId)->exists()) {
                $alreadyAssignedCount++;
                continue;
            }

            TicketAssignee::create([
                'ticket_id' => $ticket->id,
                'user_id' => $userId,
            ]);

            $assignedCount++;
        }

        if ($assignedCount > 0) {
            $message = trans_choice('tickets.assignment.assigned_successfully_count', $assignedCount, ['count' => $assignedCount]);

            if ($alreadyAssignedCount > 0) {
                $message .= ' ' . trans_choice('tickets.assignment.already_assigned_count', $alreadyAssignedCount, ['count' => $alreadyAssignedCount]);
            }

            if ($cannotBeAssignedCount > 0) {
                $message .= ' ' . trans_choice('tickets.assignment.cannot_be_assigned_count', $cannotBeAssignedCount, ['count' => $cannotBeAssignedCount]);
            }

            return back()->with('success', $message);
        }

        if ($alreadyAssignedCount > 0) {
            return back()->with('error', __('tickets.assignment.all_already_assigned'));
        }

        if ($cannotBeAssignedCount > 0) {
            return back()->with('error', __('tickets.assignment.all_cannot_be_assigned'));
        }

        return back()->with('error', __('tickets.assignment.no_users_assigned'));
    }

    /**
     * Self-assign a ticket
     */
    public function selfAssign(Request $request, Ticket $ticket)
    {
        $this->authorize('selfAssign', $ticket);

        if ($ticket->assignees()->where('user_id', $request->user()->id)->exists()) {
            return back()->with('error', __('tickets.assignment.already_assigned'));
        }

        TicketAssignee::create([
            'ticket_id' => $ticket->id,
            'user_id' => $request->user()->id,
        ]);

        return back()->with('success', __('tickets.assignment.self_assigned_successfully'));
    }
}

