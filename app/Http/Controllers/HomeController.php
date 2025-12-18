<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // On utilise paginate(10, ['*'], 'nom_du_parametre') 
        // pour permettre plusieurs paginations sur la même page
        
        $userCreatedTickets = Ticket::where('author_id', $user->id)
            ->with(['status', 'priority', 'category'])
            ->whereHas('status', fn($q) => $q->where('is_closed', false))
            ->latest('updated_at')
            ->paginate(15, ['*'], 'u_open');

        $userClosedTickets = Ticket::where('author_id', $user->id)
            ->with(['status', 'priority', 'category'])
            ->whereHas('status', fn($q) => $q->where('is_closed', true))
            ->where('updated_at', '>=', $thirtyDaysAgo)
            ->latest('updated_at')
            ->paginate(15, ['*'], 'u_closed');

        $assignedTickets = null;
        $assignedClosedTickets = null;

        if ($user->hasAnyRole(['admin', 'solver'])) {
            $assignedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', false))
                ->latest('updated_at')
                ->paginate(15, ['*'], 'a_open');

            $assignedClosedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', true))
                ->where('updated_at', '>=', $thirtyDaysAgo)
                ->latest('updated_at')
                ->paginate(15, ['*'], 'a_closed');
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