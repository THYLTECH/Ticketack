<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\AssetAttribute;
use App\Models\User;
use App\Models\TicketStatus;
use App\Models\TicketPriority;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Date range for filtering
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        $createdTickets = DB::table('tickets')
            ->select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $resolvedTickets = DB::table('tickets')
            ->select(DB::raw('DATE(tickets.updated_at) as date'), DB::raw('count(distinct tickets.id) as count'))
            ->join('ticket_assignees', 'tickets.id', '=', 'ticket_assignees.ticket_id')
            ->whereBetween('tickets.updated_at', [$startDate, $endDate])
            ->whereIn('tickets.status_id', function ($query) {
                $query->select('id')->from('ticket_statuses')->where('is_closed', true);
            })
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $period = CarbonPeriod::create($startDate, $endDate);
        $activityData = collect($period)->map(function ($date) use ($createdTickets, $resolvedTickets) {
            $dateString = $date->format('Y-m-d');

            return [
                'date' => $dateString,
                'created' => $createdTickets->get($dateString)->count ?? 0,
                'resolved' => $resolvedTickets->get($dateString)->count ?? 0,
            ];
        })->values();

        //General Statistics
        $statsGeneral = [
            'total_assets' => Asset::count(),
            'total_users' => User::count(),
            'avg_resolution_time' => 0, // TODO
            'activity' => $activityData
        ];

        // Ticket Statistics
        $queryTickets = Ticket::whereBetween('created_at', [$startDate, $endDate]);
        $queryTickets = Ticket::whereBetween('created_at', [$startDate, $endDate]);
        $statsTickets = [
            'total' => (clone $queryTickets)->count(),
            'by_status' => TicketStatus::withCount([
                'tickets' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }
            ])->get(),
            'by_priority' => TicketPriority::withCount([
                'tickets' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }
            ])->get(),
            'by_category' => TicketCategory::withCount([
                'tickets' => function ($query) use ($startDate, $endDate) {
                    $query->whereBetween('created_at', [$startDate, $endDate]);
                }
            ])->get(),
        ];

        //User Statistics
        $statsUsers = [
            'by_assigned' => User::select('users.id', 'users.name')
                ->join('ticket_assignees', 'users.id', '=', 'ticket_assignees.user_id')
                ->join('tickets', 'ticket_assignees.ticket_id', '=', 'tickets.id')
                ->whereBetween('tickets.updated_at', [$startDate, $endDate])
                ->selectRaw('count(tickets.id) as tickets_count')
                ->groupBy('users.id', 'users.name')
                ->orderBy('tickets_count', 'desc')
                ->get(),

            'by_created' => User::select('users.id', 'users.name')
                ->join('tickets', 'users.id', '=', 'tickets.author_id')
                ->whereBetween('tickets.created_at', [$startDate, $endDate])
                ->selectRaw('count(tickets.id) as tickets_count')
                ->groupBy('users.id', 'users.name')
                ->orderBy('tickets_count', 'desc')
                ->get(),

            'by_resolved' => User::select('users.id', 'users.name')
                ->join('ticket_assignees', 'users.id', '=', 'ticket_assignees.user_id')
                ->join('tickets', 'ticket_assignees.ticket_id', '=', 'tickets.id')
                ->join('ticket_statuses', 'tickets.status_id', '=', 'ticket_statuses.id')
                ->where('ticket_statuses.is_closed', true)
                ->whereBetween('tickets.updated_at', [$startDate, $endDate])
                ->selectRaw('count(tickets.id) as tickets_count')
                ->groupBy('users.id', 'users.name')
                ->orderBy('tickets_count', 'desc')
                ->get(),

            'by_time' => User::select('users.id', 'users.name')
                ->join('ticket_entries', 'users.id', '=', 'ticket_entries.user_id')
                ->whereBetween('ticket_entries.created_at', [$startDate, $endDate])
                ->selectRaw('sum(ticket_entries.duration_seconds) as total_seconds')
                ->groupBy('users.id', 'users.name')
                ->orderBy('total_seconds', 'desc')
                ->get()
                ->map(function ($user) {
                    // Conversion en heures lisibles pour le frontend
                    $user->total_hours = round($user->total_seconds / 3600, 1);
                    return $user;
                }),
        ];

        $activeUserIds = collect([
            $statsUsers['by_assigned']->pluck('id'),
            $statsUsers['by_created']->pluck('id'),
            $statsUsers['by_resolved']->pluck('id'),
            $statsUsers['by_time']->pluck('id'),
        ])->flatten()->unique();

        $users = User::select('id', 'name', 'attachment_avatar')
            ->whereIn('id', $activeUserIds)
            ->orderBy('name', 'asc')
            ->get();

        //Asset Statistics
        $statsAssets = [
            'by_asset' => Asset::select('assets.id', 'assets.title', 'assets.description', 'assets.icon')
                ->withCount([
                    'tickets' => function ($query) use ($startDate, $endDate) {
                        $query->whereBetween('created_at', [$startDate, $endDate]);
                    }
                ])
                ->groupBy('assets.id', 'assets.title', 'assets.description', 'assets.icon') 
                ->having('tickets_count', '>', 0)
                ->orderBy('tickets_count', 'desc')
                ->get(),

            'by_attribute' => AssetAttribute::join('tickets', 'asset_attributes.asset_id', '=', 'tickets.asset_id')
                ->select('asset_attributes.key')
                ->selectRaw('count(tickets.id) as count')
                ->whereBetween('tickets.created_at', [$startDate, $endDate])
                ->groupBy('asset_attributes.key')
                ->orderBy('count', 'desc')
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'statsGeneral' => $statsGeneral,
            'statsTickets' => $statsTickets,
            'statsAssets' => $statsAssets,
            'statsUsers' => $statsUsers,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ],
            'users' => $users
        ]);
    }
}