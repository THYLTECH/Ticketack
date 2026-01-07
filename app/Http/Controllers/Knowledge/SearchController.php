<?php

namespace App\Http\Controllers\Knowledge;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\User;
use App\Services\Knowledge\VectorSearchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function __construct(
        private readonly VectorSearchService $vectorSearch
    ) {
        $this->middleware('can:view knowledge explorer');
    }

    public function index(): Response
    {

        return Inertia::render('knowledge/search', [
            'users' => User::all(['id', 'name']),
            'categories' => TicketCategory::all(['id', 'title']),
            'assets' => Asset::all(['id', 'title']),
        ]);
    }

    public function search(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'query' => 'required|string|min:3',
            'author_id' => 'nullable|string',
            'category_id' => 'nullable|string',
            'asset_id' => 'nullable|string',
            'type_filter' => 'nullable|string',
            'date_from' => 'nullable|date',
            'date_to' => 'nullable|date',
            'limit' => 'nullable|integer|max:50',
        ]);

        $vectorResults = $this->vectorSearch->search([
            'query' => $validated['query'],
            'filters' => $this->buildFilters($validated),
            'limit' => $validated['limit'] ?? 20,
        ]);

        if (isset($vectorResults['error'])) {
            return response()->json([
                'results' => [],
                'error' => 'Search service unavailable',
            ], 503);
        }

        $ticketIds = collect($vectorResults)->pluck('ticket_id')->filter();

        $ticketQuery = Ticket::with([
            'author:id,name,attachment_avatar',
            'author.avatar',
            'category:id,title'
        ])->whereIn('id', $ticketIds);

        if (!empty($validated['author_id'])) {
            $ticketQuery->whereIn('author_id', explode(',', $validated['author_id']));
        }

        if (!empty($validated['category_id'])) {
            $ticketQuery->whereIn('category_id', explode(',', $validated['category_id']));
        }

        if (!empty($validated['asset_id'])) {
            $ticketQuery->whereIn('asset_id', explode(',', $validated['asset_id']));
        }

        if (!empty($validated['date_from'])) {
            $ticketQuery->whereDate('created_at', '>=', $validated['date_from']);
        }

        if (!empty($validated['date_to'])) {
            $ticketQuery->whereDate('created_at', '<=', $validated['date_to']);
        }

        $tickets = $ticketQuery->get()->keyBy('id');

        $results = collect($vectorResults)->map(function ($result) use ($tickets) {
            if (!isset($result['ticket_id'])) {
                return null;
            }

            /** @var Ticket|null $ticket */
            $ticket = $tickets->get($result['ticket_id']);

            if (!$ticket) {
                return null;
            }

            $normalizedScore = max(0, min(1, 1 - ($result['score'] / 2)));

            return [
                'id' => $result['ticket_id'],
                'ticket_id' => $ticket->id,
                'title' => $ticket->title,
                'snippet' => $ticket->description ?? '',
                'score' => $normalizedScore,
                'type' => 'ticket',
                'created_at' => $ticket->created_at->toIso8601String(),
                'author' => [
                    'name' => $ticket->author?->name ?? 'Unknown',
                    'avatar' => $ticket->author?->avatar?->url ?? null,
                ],
                'category' => $ticket->category?->title,
                'solution' => $ticket->is_referenced ? $ticket->detailed_solution : null,
                'has_solution' => (bool) $ticket->is_referenced,
            ];
        })->filter()->values();

        return response()->json([
            'results' => $results,
            'total' => $results->count(),
        ]);
    }

    private function buildFilters(array $validated): array
    {
        $filters = [];

        if (!empty($validated['author_id'])) {
            $filters['author_ids'] = explode(',', $validated['author_id']);
        }

        if (!empty($validated['category_id'])) {
            $filters['category_ids'] = explode(',', $validated['category_id']);
        }

        if (!empty($validated['asset_id'])) {
            $filters['asset_ids'] = explode(',', $validated['asset_id']);
        }

        if (!empty($validated['type_filter'])) {
            $filters['types'] = explode(',', $validated['type_filter']);
        }

        if (!empty($validated['date_from'])) {
            $filters['date_from'] = $validated['date_from'];
        }

        if (!empty($validated['date_to'])) {
            $filters['date_to'] = $validated['date_to'];
        }

        return $filters;
    }
}
