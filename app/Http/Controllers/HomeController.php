<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Affiche la page d'accueil avec les listes de tickets paginées.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $thirtyDaysAgo = Carbon::now()->subDays(30);

        // 1. On récupère le choix de l'utilisateur pour le nombre de lignes par page.
        // On utilise la clé 'per_page' pour correspondre à votre composant PaginationControl.tsx.
        $perPage = $request->input('per_page', 15);

        // 2. Pagination des tickets créés par l'utilisateur (Ouverts)
        // On ajoute ->withQueryString() pour que les liens conservent les autres paramètres de l'URL.
        $userCreatedTickets = Ticket::where('author_id', $user->id)
            ->with(['status', 'priority', 'category'])
            ->whereHas('status', fn($q) => $q->where('is_closed', false))
            ->latest('updated_at')
            ->paginate($perPage, ['*'], 'u_open')
            ->withQueryString();

        // 3. Pagination des tickets créés par l'utilisateur (Fermés - 30 derniers jours)
        $userClosedTickets = Ticket::where('author_id', $user->id)
            ->with(['status', 'priority', 'category'])
            ->whereHas('status', fn($q) => $q->where('is_closed', true))
            ->where('updated_at', '>=', $thirtyDaysAgo)
            ->latest('updated_at')
            ->paginate($perPage, ['*'], 'u_closed')
            ->withQueryString();

        $assignedTickets = null;
        $assignedClosedTickets = null;

        // 4. Pagination des tickets assignés (si autorisé)
        if ($user->can('be assigned tickets')) {
            $assignedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', false))
                ->latest('updated_at')
                ->paginate($perPage, ['*'], 'a_open')
                ->withQueryString();

            $assignedClosedTickets = Ticket::whereHas('assignees', fn($q) => $q->where('user_id', $user->id))
                ->with(['status', 'priority', 'category', 'user'])
                ->whereHas('status', fn($q) => $q->where('is_closed', true))
                ->where('updated_at', '>=', $thirtyDaysAgo)
                ->latest('updated_at')
                ->paginate($perPage, ['*'], 'a_closed')
                ->withQueryString();
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