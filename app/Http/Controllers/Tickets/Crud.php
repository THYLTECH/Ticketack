<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tickets\Store as RequestsStore;
use App\Http\Requests\Tickets\Update as RequestsUpdate;
use App\Models\Asset;
use App\Models\Attachment;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\TicketCategory;
use App\Models\TicketEntry;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
use App\Services\Knowledge\VectorSearchService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class Crud extends Controller
{
    public function __construct(
        private readonly VectorSearchService $vectorSearch
    ) {
        $this->authorizeResource(Ticket::class, 'ticket');
    }

    /**
     * Display a listing of tickets with filters.
     */
    public function index(Request $request): Response
    {
        return $this->renderTicketList($request, 'tickets/index');
    }

    /**
     * Display management view for solver/admin.
     */
    public function manage(Request $request): Response
    {
        return $this->renderTicketList($request, 'tickets/manage');
    }

    /**
     * Helper to render a ticket list based on roles and view.
     */
    private function renderTicketList(Request $request, string $view): Response
    {
        /** @var User $user */
        $user = Auth::user();

        $query = Ticket::with([
            'user:id,name,attachment_avatar,email',
            'user.avatar',
            'priority',
            'status',
            'category',
            'asset',
            'assignees.user:id,name,attachment_avatar,email',
            'assignees.user.avatar'
        ]);

        if (! $user->hasRole('admin')) {
            if ($user->hasRole('solver')) {
                if ($view === 'tickets/manage') {
                    $query->where(function (Builder $q) use ($user) {
                        $q->where('author_id', $user->id)
                            ->orWhereHas('assignees', function (Builder $subQ) use ($user) {
                                $subQ->where('user_id', $user->id);
                            });
                    });
                }
            } else {
                $query->where('author_id', $user->id);
            }
        }

        $query = $this->applyFilters($query, $request);

        $tickets = $query->paginate(10)->withQueryString();

        return Inertia::render($view, [
            'tickets' => $tickets,
            'filters' => $request->only(['search', 'status', 'priority', 'category', 'equipment', 'assignee', 'date_from', 'date_to', 'sort', 'direction']),
            'statuses' => TicketStatus::all(),
            'priorities' => TicketPriority::all(),
            'categories' => TicketCategory::all(),
            'assets' => Asset::all(['id', 'title']),
            'solvers' => User::role(['admin', 'solver'])->with('avatar')->get(['id', 'name', 'attachment_avatar']),
        ]);
    }

    /**
     * Applies search and filters to the ticket query.
     */
    private function applyFilters(Builder $query, Request $request): Builder
    {
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('id', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('asset', function (Builder $qAsset) use ($search) {
                        $qAsset->where('title', 'like', "%$search%");
                    });
            });
        }

        foreach (['status' => 'status_id', 'priority' => 'priority_id', 'category' => 'category_id', 'equipment' => 'asset_id'] as $key => $column) {
            if ($request->filled($key) && $request->input($key) !== 'all') {
                $query->whereIn($column, explode(',', $request->input($key)));
            }
        }

        if ($request->filled('assignee') && $request->input('assignee') !== 'all') {
            $query->whereHas('assignees', fn($q) => $q->whereIn('user_id', explode(',', $request->input('assignee'))));
        }

        if ($request->filled('date_from') && $request->filled('date_to')) {
            $query->whereBetween('updated_at', [$request->date_from . ' 00:00:00', $request->date_to . ' 23:59:59']);
        }

        $sort = $request->input('sort', 'updated_at');
        $direction = $request->input('direction', 'desc');
        $allowedSorts = ['title', 'status_id', 'priority_id', 'category_id', 'created_at', 'updated_at'];

        return $query->orderBy(in_array($sort, $allowedSorts) ? $sort : 'updated_at', $direction);
    }

    public function create(): Response
    {
        return Inertia::render('tickets/create', [
            'priorities' => TicketPriority::orderBy('sort_order')->get(),
            'categories' => TicketCategory::orderBy('sort_order')->get(),
            'statuses' => TicketStatus::orderBy('sort_order')->get(),
            'assets' => Asset::getTreeOrderedAssets(),
            'users' => User::with(['roles', 'avatar'])->get(),
        ]);
    }

    public function show(Ticket $ticket): Response
    {
        $ticket->load([
            'user.avatar', 'priority', 'status', 'category', 'asset',
            'assignees.user.avatar', 'comments.user.avatar', 'comments.attachments',
            'logs.user.avatar', 'schedules.user.avatar', 'attachments',
        ]);

        $searchContext = implode(' ', array_filter([
            $ticket->title,
            $ticket->description,
            $ticket->category?->title,
            $ticket->asset?->title,
        ]));

        $similarTickets = [];

        try {
            $results = $this->vectorSearch->search([
                'query' => $searchContext,
                'limit' => 6,
            ]);

            if (!empty($results) && !isset($results['error'])) {
                $filteredResults = collect($results)
                    ->filter(fn($r) => $r['ticket_id'] != $ticket->id)
                    ->take(6);

                if ($filteredResults->isNotEmpty()) {
                    $ticketsInfo = Ticket::whereIn('id', $filteredResults->pluck('ticket_id'))
                        ->get(['id', 'title'])
                        ->keyBy('id');

                    $similarTickets = $filteredResults->map(function ($result) use ($ticketsInfo) {
                        $info = $ticketsInfo->get($result['ticket_id']);
                        if (!$info) return null;

                        return [
                            'id' => $info->id,
                            'title' => $info->title,
                            'similarity' => round(max(0, min(1, 1 - ($result['score'] / 2))) * 100),
                        ];
                    })->filter()->values()->toArray();
                }
            }
        } catch (Throwable) {
        }

        $schedules = TicketSchedule::with(['user.avatar', 'ticket.priority', 'ticket.status', 'ticket.category'])
            ->get()
            ->map(function ($schedule) {
                return [
                    'id' => $schedule->id,
                    'ticket_id' => $schedule->ticket_id,
                    'user_id' => $schedule->user_id,
                    'start_date' => $schedule->start_date,
                    'end_date' => $schedule->end_date,
                    'duration_minutes' => $schedule->duration_minutes,
                    'is_entry' => false,
                    'ticket' => $schedule->ticket,
                    'user' => $schedule->user,
                    'created_at' => $schedule->created_at->toIso8601String(),
                    'updated_at' => $schedule->updated_at->toIso8601String(),
                ];
            });

        $entries = TicketEntry::with(['user.avatar', 'ticket.priority', 'ticket.status', 'ticket.category'])
            ->whereNotNull('start_at')
            ->whereNotNull('end_at')
            ->get()
            ->map(fn($entry) => $entry->toCalendarEvent())
            ->filter();

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'events' => $schedules->concat($entries)->values()->toArray(),
            'solvers' => User::role(['admin', 'solver'])->with('avatar')->get()->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ])->toArray(),
            'similar_tickets' => $similarTickets,
        ]);
    }

    /**
     * @throws Throwable
     */
    public function store(RequestsStore $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();
            /** @var User $user */
            $user = $request->user();

            if (!$user->hasAnyRole(['admin', 'solver'])) {
                unset(
                    $data['detailed_solution'],
                    $data['is_referenced'],
                    $data['assignees'],
                    $data['status_id']
                );
            }

            $ticket = Ticket::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'author_id' => $user->id,
                'is_public' => $data['is_public'] ?? false,
                'is_referenced' => $data['is_referenced'] ?? false,
                'detailed_solution' => $data['detailed_solution'] ?? null,
                'priority_id' => $data['priority_id'],
                'category_id' => $data['category_id'],
                'status_id' => $data['status_id'] ?? TicketStatus::orderBy('sort_order')->first()->id ?? null,
                'asset_id' => $data['asset_id'] ?? null,
            ]);

            if (!empty($data['assignees']) && $user->hasAnyRole(['admin', 'solver'])) {
                foreach ($data['assignees'] as $assignee) {
                    $ticket->assignees()->create(['user_id' => $assignee['id']]);
                }
            }

            if ($request->hasFile('attachments')) {
                $this->handleAttachments($request->file('attachments'), $ticket);
            }

            return redirect()->route('tickets.manage')->with('success', __('tickets.flash.created'));
        });
    }

    public function edit(Ticket $ticket): Response
    {
        $ticket->load(['assignees.user.avatar', 'attachments']);

        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'priorities' => TicketPriority::orderBy('sort_order')->get(),
            'categories' => TicketCategory::orderBy('sort_order')->get(),
            'statuses' => TicketStatus::orderBy('sort_order')->get(),
            'assets' => Asset::getTreeOrderedAssets(),
            'users' => User::with(['roles', 'avatar'])->get(),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function update(RequestsUpdate $request, Ticket $ticket): RedirectResponse
    {
        $data = $request->validated();

        $newFilesCount = count($request->file('attachments') ?? []);
        $existingFilesCount = $ticket->attachments()->count();

        if (($newFilesCount + $existingFilesCount) > 10) {
            return back()->withErrors([__('tickets.controller.attachments_limit')]);
        }

        return DB::transaction(function () use ($data, $ticket, $request) {
            /** @var User $user */
            $user = $request->user();

            if (!$user->hasAnyRole(['admin', 'solver'])) {
                $data = collect($data)->only(['title', 'description', 'asset_id', 'is_public'])->toArray();
            }

            $ticket->update($data);

            if (isset($data['assignees']) && $user->hasAnyRole(['admin', 'solver'])) {
                $newIds = collect($data['assignees'])->pluck('id')->toArray();
                $ticket->assignees()->whereNotIn('user_id', $newIds)->get()->each->delete();

                foreach ($newIds as $userId) {
                    $ticket->assignees()->updateOrCreate(['user_id' => $userId]);
                }
            }

            if ($request->hasFile('attachments')) {
                $this->handleAttachments($request->file('attachments'), $ticket);
            }

            return redirect()->route('tickets.show', $ticket)->with('success', __('tickets.flash.updated'));
        });
    }

    public function destroy(Ticket $ticket): RedirectResponse
    {
        /** @var User $user */
        $user = Auth::user();

        $isAssigned = $ticket->assignees()->where('user_id', $user->id)->exists();

        if (!$user->hasRole('admin') && !$isAssigned) {
            abort(403, "Action non autorisée. Seul un administrateur ou le solveur assigné peut archiver ce ticket.");
        }

        $ticket->delete();
        return redirect()->route('tickets.manage')->with('success', __('tickets.flash.deleted'));
    }

    /**
     * Helper to handle attachment uploads.
     */
    private function handleAttachments(array $files, Ticket $ticket): void
    {
        foreach ($files as $file) {
            $path = Storage::disk('public')->putFile("tickets/$ticket->id/attachments", $file);
            $originalName = $file->getClientOriginalName();

            $attachment = Attachment::create([
                'title' => $originalName,
                'file_name' => $originalName,
                'file_path' => $path,
                'mime_type' => $file->getMimeType(),
                'file_extension' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
            ]);

            TicketAttachment::create([
                'ticket_id' => $ticket->id,
                'attachment_id' => $attachment->id,
            ]);
        }
        $ticket->touch();
    }

    public function restore(Ticket $ticket): RedirectResponse
    {
        $this->authorize('restore', $ticket);
        $ticket->restore();
        return redirect()->back()->with('success', __('tickets.flash.restored'));
    }

    public function forceDelete(Ticket $ticket): RedirectResponse
    {
        $this->authorize('forceDelete', $ticket);
        $ticket->forceDelete();
        return redirect()->route('tickets.manage')->with('success', __('tickets.flash.force_deleted'));
    }
}
