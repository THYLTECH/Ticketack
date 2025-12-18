<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Ticket;
use App\Models\User;
use App\Models\TicketStatus;
use App\Models\TicketPriority;
use App\Models\TicketCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Date range for filtering
        $startDate = $request->input('start_date', Carbon::now()->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::now()->endOfMonth()->toDateString());

        //Global Statistics
        $globalStats = [
            'total_assets' => Asset::count(),
            'total_users' => User::count(),
            'avg_resolution_time' => 0, 
        ];

        // Ticket Statistics
        $queryTickets = Ticket::whereBetween('created_at', [$startDate, $endDate]);

        $statsTickets = [
            'total' => (clone $queryTickets)->count(),
            'by_status' => TicketStatus::withCount(['tickets' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }])->get(),
            'by_priority' => TicketPriority::withCount(['tickets' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }])->get(),
            'by_category' => TicketCategory::withCount(['tickets' => function($query) use ($startDate, $endDate) {
                $query->whereBetween('created_at', [$startDate, $endDate]);
            }])->get(),
        ];

        //User Statistics
        //TODO

        //Asset Statistics
        $statsAssets = [
            'by_asset' => Asset::select('id', 'title', 'description', 'icon')
                ->withCount('tickets')
                ->orderBy('tickets_count', 'desc')
                ->get(),
        ];

        return Inertia::render('dashboard', [
            'statsGlobales' => $globalStats,
            'statsTickets' => $statsTickets,
            'statsAssets' => $statsAssets,
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]
        ]);
    }
}