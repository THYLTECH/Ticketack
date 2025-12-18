<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // 1. Tickets créés par l'utilisateur
        $userCreatedTickets = Ticket::where('author_id', $user->id)
            ->with(['status', 'priority', 'category'])
            ->whereHas('status', fn($q) => $q->where('is_closed', false))
            ->get();

        $userClosedTickets = Ticket::where('author_id', $user->id)
            ->with(['status', 'priority', 'category'])
            ->whereHas('status', fn($q) => $q->where('is_closed', true))
            ->where('updated_at', '>=', $thirtyDaysAgo)
            ->get();

        // Initialisation des données pour les solveurs/admins
        $assignedTickets = [];
        $assignedClosedTickets = [];

        // 2. Si l'utilisateur est solveur ou admin (on vérifie via les rôles Spatie)
        if ($user->hasAnyRole(['admin', 'solver'])) {
            $assignedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', false))
                ->get();

            $assignedClosedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', true))
                ->where('updated_at', '>=', $thirtyDaysAgo)
                ->get();
        }

        return Inertia::render('home', [
            'userTickets' => [
                'open' => $userCreatedTickets,
                'closed' => $userClosedTickets,
            ],
            'assignedTickets' => [
                'open' => $assignedTickets,
                'closed' => $assignedClosedTickets,
            ],
        ]);
    }
}