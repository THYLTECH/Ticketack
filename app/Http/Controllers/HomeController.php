<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Models\TicketEntry;
use App\Models\TicketSchedule;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Affiche la page d'accueil avec un dashboard personnalisé selon les permissions.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $mode = $user->home_page_mode ?? 'default';


        $props = [
            'home_page_mode' => $mode,
            'home_page_layout' => $user->home_page_layout,
        ];

        if ($mode === 'construction' || $mode === 'classic') {
            $userTickets = [
                'open' => Ticket::where('author_id', $user->id)
                    ->whereHas('status', fn($q) => $q->where('is_closed', false))
                    ->with(['status', 'priority', 'category', 'user'])
                    ->latest('updated_at')
                    ->paginate(10, ['*'], 'user_open_page'),
                'closed' => Ticket::where('author_id', $user->id)
                    ->whereHas('status', fn($q) => $q->where('is_closed', true))
                    ->with(['status', 'priority', 'category', 'user'])
                    ->latest('updated_at')
                    ->paginate(10, ['*'], 'user_closed_page'),
            ];

            $assignedTickets = null;
            if ($user->can('be assigned tickets')) {
                $assignedTickets = [
                    'open' => Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                        ->whereHas('status', fn($q) => $q->where('is_closed', false))
                        ->with(['status', 'priority', 'category', 'user'])
                        ->latest('updated_at')
                        ->paginate(10, ['*'], 'assigned_open_page'),
                    'closed' => Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                        ->whereHas('status', fn($q) => $q->where('is_closed', true))
                        ->with(['status', 'priority', 'category', 'user'])
                        ->latest('updated_at')
                        ->paginate(10, ['*'], 'assigned_closed_page'),
                ];
            }

            return Inertia::render('home', array_merge($props, [
                'userTickets' => $userTickets,
                'assignedTickets' => $assignedTickets,
            ]));
        }

        $now = Carbon::now();
        $thirtyDaysAgo = $now->copy()->subDays(30);
        $weekStart = $now->copy()->startOfWeek();
        $weekEnd = $now->copy()->endOfWeek();

        $userOpenTicketsCount = Ticket::where('author_id', $user->id)
            ->whereHas('status', fn($q) => $q->where('is_closed', false))
            ->count();

        $userClosedTicketsCount = Ticket::where('author_id', $user->id)
            ->whereHas('status', fn($q) => $q->where('is_closed', true))
            ->where('updated_at', '>=', $thirtyDaysAgo)
            ->count();

        $recentUserTickets = Ticket::where('author_id', $user->id)
            ->whereHas('status', fn($q) => $q->where('is_closed', false))
            ->with(['status', 'priority', 'category'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        $recentUserClosedTickets = Ticket::where('author_id', $user->id)
            ->whereHas('status', fn($q) => $q->where('is_closed', true))
            ->where('updated_at', '>=', $thirtyDaysAgo)
            ->with(['status', 'priority', 'category'])
            ->latest('updated_at')
            ->take(5)
            ->get();

        $assignedStats = null;
        $assignedTickets = null;
        $assignedClosedTickets = null;
        $recentEntries = null;
        $upcomingSchedules = null;
        $weeklyHours = null;

        if ($user->can('be assigned tickets')) {
            $assignedOpenCount = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->whereHas('status', fn($q) => $q->where('is_closed', false))
                ->count();

            $assignedClosedCount = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->whereHas('status', fn($q) => $q->where('is_closed', true))
                ->where('updated_at', '>=', $thirtyDaysAgo)
                ->count();

            $assignedStats = [
                'open' => $assignedOpenCount,
                'closed' => $assignedClosedCount,
            ];

            $assignedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', false))
                ->latest('updated_at')
                ->take(5)
                ->get();

            $assignedClosedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', true))
                ->where('updated_at', '>=', $thirtyDaysAgo)
                ->latest('updated_at')
                ->take(5)
                ->get();
        }

        if ($user->can('view ticket entries')) {
            $weeklySeconds = TicketEntry::where('user_id', $user->id)
                ->whereBetween('start_at', [$weekStart, $weekEnd])
                ->sum('duration_seconds');

            $weeklyHours = round($weeklySeconds / 3600, 1);

            $recentEntries = TicketEntry::where('user_id', $user->id)
                ->with(['ticket.status', 'ticket.priority'])
                ->latest('start_at')
                ->take(5)
                ->get();
        }

        if ($user->can('view planning')) {
            $upcomingSchedules = TicketSchedule::where('user_id', $user->id)
                ->with(['ticket.status', 'ticket.priority'])
                ->where('start_date', '>=', $now)
                ->orderBy('start_date')
                ->take(5)
                ->get();
        }

        $adminStats = null;
        $recentActivity = null;

        if ($user->can('view dashboard')) {
            $totalTickets = Ticket::count();
            $totalOpenTickets = Ticket::whereHas('status', fn($q) => $q->where('is_closed', false))->count();
            $ticketsClosedToday = Ticket::whereHas('status', fn($q) => $q->where('is_closed', true))
                ->whereDate('updated_at', $now->toDateString())
                ->count();
            $totalUsers = User::count();
            $unassignedTickets = Ticket::whereHas('status', fn($q) => $q->where('is_closed', false))
                ->whereDoesntHave('assignees')
                ->count();

            $adminStats = [
                'total_tickets' => $totalTickets,
                'total_open' => $totalOpenTickets,
                'closed_today' => $ticketsClosedToday,
                'total_users' => $totalUsers,
                'unassigned' => $unassignedTickets,
            ];

            $recentActivity = Ticket::with(['status', 'priority', 'user'])
                ->latest('updated_at')
                ->take(10)
                ->get();
        }

        return Inertia::render('home', array_merge($props, [
            'stats' => [
                'user' => [
                    'open' => $userOpenTicketsCount,
                    'closed' => $userClosedTicketsCount,
                ],
                'assigned' => $assignedStats,
                'weekly_hours' => $weeklyHours,
                'admin' => $adminStats,
            ],
            'recentUserTickets' => $recentUserTickets,
            'recentUserClosedTickets' => $recentUserClosedTickets,
            'assignedTickets' => $assignedTickets,
            'assignedClosedTickets' => $assignedClosedTickets,
            'recentEntries' => $recentEntries,
            'upcomingSchedules' => $upcomingSchedules,
            'recentActivity' => $recentActivity,
        ]));
    }
    public function updateSettings(Request $request)
    {
        $data = $request->validate([
            'home_page_mode' => 'nullable|string|in:default,classic,construction',
            'home_page_layout' => 'nullable|array',
        ]);

        $request->user()->update([
            'home_page_mode' => $data['home_page_mode'] ?? $request->user()->home_page_mode,
        ]);

        if ($request->has('home_page_layout')) {
            $request->user()->update([
                'home_page_layout' => $request->input('home_page_layout'),
            ]);
        }

        return redirect()->back();
    }
}