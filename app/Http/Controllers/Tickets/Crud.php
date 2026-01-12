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
use App\Notifications\Tickets\Assigned as NotificationsTicketAssigned;
use App\Notifications\Tickets\Created as NotificationsTicketCreated;
use App\Notifications\Tickets\PriorityChanged as NotificationsTicketPriorityChanged;
use App\Notifications\Tickets\StatusChanged as NotificationsTicketStatusChanged;
use App\Notifications\Tickets\Unassigned as NotificationsTicketUnassigned;
use App\Notifications\Tickets\Updated as NotificationsTicketUpdated;
use App\Services\Knowledge\VectorSearchService;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
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

    private function applyUserVisibilityFilter(Builder $query, User $user, bool $onlyMyTickets = false): Builder
    {
        if ($user->hasRole('admin')) {
            return $query;
        }

        if ($user->hasRole('solver')) {
            if ($onlyMyTickets) {
                return $query->where(function (Builder $q) use ($user) {
                    $q->where('author_id', $user->id)
                        ->orWhereHas('assignees', function (Builder $subQ) use ($user) {
                            $subQ->where('user_id', $user->id);
                        });
                });
            }
            return $query;
        }

        return $query->where('author_id', $user->id);
    }

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
        ])->whereNull('archived_at');

        $onlyMyTickets = $view === 'tickets/manage';
        $query = $this->applyUserVisibilityFilter($query, $user, $onlyMyTickets);

        $query = $this->applyFilters($query, $request);

        $tickets = $query->paginate(10)->withQueryString();

        $statsQuery = Ticket::query();
        $statsQuery = $this->applyUserVisibilityFilter($statsQuery, $user, $onlyMyTickets);

        $total = $statsQuery->count();

        $open = (clone $statsQuery)
            ->where(function (Builder $q) {
                $q->whereHas('status', fn (Builder $subQ) => $subQ->where('is_closed', false))
                    ->orWhereNull('status_id');
            })
            ->count();

        $unassigned = (clone $statsQuery)
            ->whereDoesntHave('assignees')
            ->count();

        $resolved = (clone $statsQuery)
            ->whereHas('status', fn (Builder $q) => $q->where('is_closed', true))
            ->count();

        $driver = config('database.default');
        $connection = config("database.connections.$driver.driver");

        if ($connection === 'sqlite') {
            $avgResolutionDays = (clone $statsQuery)
                ->whereHas('status', fn (Builder $q) => $q->where('is_closed', true))
                ->whereNotNull('updated_at')
                ->selectRaw('AVG(JULIANDAY(updated_at) - JULIANDAY(created_at)) as avg_days')
                ->value('avg_days') ?? 0;
        } else {
            $avgResolutionDays = (clone $statsQuery)
                ->whereHas('status', fn (Builder $q) => $q->where('is_closed', true))
                ->whereNotNull('updated_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(DAY, created_at, updated_at)) as avg_days')
                ->value('avg_days') ?? 0;
        }

        $assignedToMe = (clone $statsQuery)
            ->whereHas('assignees', function (Builder $q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->count();

        $archivedCount = Ticket::whereNotNull('archived_at');
        $archivedCount = $this->applyUserVisibilityFilter($archivedCount, $user, $view === 'tickets/manage');
        $archivedCount = $archivedCount->count();

        $stats = [
            'total' => $total,
            'open' => $open,
            'unassigned' => $unassigned,
            'resolved' => $resolved,
            'avg_resolution_days' => (float) $avgResolutionDays,
            'assigned_to_me' => $assignedToMe,
            'archived' => $archivedCount,
        ];

        return Inertia::render($view, [
            'tickets' => $tickets,
            'stats' => $stats,
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
            ->where('ticket_id', $ticket->id)
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
            ->where('ticket_id', $ticket->id)
            ->whereNotNull('start_at')
            ->whereNotNull('end_at')
            ->get()
            ->map(fn($entry) => $entry->toCalendarEvent())
            ->filter(fn($event) => !empty($event));

        $events = $schedules->concat($entries)->values()->all();

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'events' => $events,
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
                'archived_at' => isset($data['is_archived']) && $data['is_archived'] ? now() : null,
                'is_referenced' => $data['is_referenced'] ?? false,
                'detailed_solution' => $data['detailed_solution'] ?? null,
                'priority_id' => $data['priority_id'],
                'category_id' => $data['category_id'],
                'status_id' => $data['status_id'] ?? TicketStatus::orderBy('sort_order')->first()->id ?? null,
                'asset_id' => $data['asset_id'] ?? null,
            ]);

            if (!empty($data['assignees']) && $user->hasAnyRole(['admin', 'solver'])) {
                $assignees = is_array($data['assignees']) ? $data['assignees'] : [];

                foreach ($assignees as $assignee) {
                    $ticket->assignees()->create(['user_id' => $assignee['id']]);

                    Notification::send(User::find($assignee['id']), new NotificationsTicketCreated($ticket));
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

            $originalStatus = $ticket->status;
            $originalPriority = $ticket->priority;

            $currentAssigneeIds = $ticket->assignees()->pluck('user_id')->toArray();

            if (isset($data['is_archived'])) {
                $data['archived_at'] = $data['is_archived'] ? now() : null;
                unset($data['is_archived']);
            }

            if (!$user->hasAnyRole(['admin', 'solver'])) {
                $data = collect($data)->only(['title', 'description', 'asset_id', 'archived_at'])->toArray();
            }

            $ticket->update($data);

            if (isset($data['assignees']) && $user->hasAnyRole(['admin', 'solver'])) {
                $newIds = is_array($data['assignees']) ? collect($data['assignees'])->pluck('id')->toArray() : [];

                $isCurrentUserRemoving = in_array($user->id, $currentAssigneeIds) && !in_array($user->id, $newIds);
                $willBeUnassigned = empty($newIds);

                if ($isCurrentUserRemoving && $willBeUnassigned && count($currentAssigneeIds) === 1) {
                    $admins = User::role('admin')->get();
                    Notification::send($admins, new NotificationsTicketUnassigned($ticket, $user));
                }

                $ticket->assignees()
                    ->whereNotIn('user_id', $newIds)
                    ->get()
                    ->each
                    ->delete();

                foreach ($newIds as $userId) {
                    $assignee = $ticket->assignees()->updateOrCreate(['user_id' => $userId]);

                    if ($assignee->wasRecentlyCreated) {
                        Notification::send(User::find($userId), new NotificationsTicketAssigned($ticket));
                    }
                }
            }

            $assignees = User::whereIn(
                'id',
                $ticket->assignees()->pluck('user_id')
            )->get();

            Notification::send($assignees, new NotificationsTicketUpdated($ticket));

            if ($request->hasFile('attachments')) {
                $this->handleAttachments($request->file('attachments'), $ticket);
            }

            if (isset($data['status']) && $data['status'] !== $originalStatus) {
                Notification::send($assignees, new NotificationsTicketStatusChanged($ticket));
            }

            if (isset($data['priority']) && $data['priority'] !== $originalPriority) {
                Notification::send($assignees, new NotificationsTicketPriorityChanged($ticket));
            }

            return redirect()
                ->route('tickets.show', $ticket)
                ->with('success', __('tickets.flash.updated'));
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

    /**
     * Display archived tickets page
     */
    public function archived(Request $request): Response
    {
        $this->authorize('viewAny', Ticket::class);

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
        ])->whereNotNull('archived_at');

        if (! $user->can('view all archived tickets')) {
            $query = $this->applyUserVisibilityFilter($query, $user, true);
        }

        $query = $this->applyFilters($query, $request);

        $tickets = $query->paginate(10)->withQueryString();

        $statsQuery = Ticket::whereNotNull('archived_at');

        if (! $user->can('view all archived tickets')) {
            $statsQuery = $this->applyUserVisibilityFilter($statsQuery, $user, true);
        }

        $total = (clone $statsQuery)->count();

        $byStatus = (clone $statsQuery)
            ->selectRaw('status_id, COUNT(*) as count')
            ->whereNotNull('status_id')
            ->groupBy('status_id')
            ->get()
            ->mapWithKeys(fn ($item) => [$item->status_id => (int) $item->count]);

        $resolved = (clone $statsQuery)
            ->whereHas('status', fn (Builder $q) => $q->where('is_closed', true))
            ->count();

        $driver = config('database.default');
        $connection = config("database.connections.$driver.driver");

        if ($connection === 'sqlite') {
            $avgArchiveDays = (clone $statsQuery)
                ->whereNotNull('archived_at')
                ->selectRaw('AVG(JULIANDAY(archived_at) - JULIANDAY(created_at)) as avg_days')
                ->value('avg_days') ?? 0;
        } else {
            $avgArchiveDays = (clone $statsQuery)
                ->whereNotNull('archived_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(DAY, created_at, archived_at)) as avg_days')
                ->value('avg_days') ?? 0;
        }

        $archivedLast30Days = (clone $statsQuery)
            ->where('archived_at', '>=', now()->subDays(30))
            ->count();

        $stats = [
            'total' => $total,
            'by_status' => $byStatus,
            'resolved' => $resolved,
            'avg_archive_days' => round((float) $avgArchiveDays, 1),
            'archived_last_30_days' => $archivedLast30Days,
        ];

        return Inertia::render('tickets/archived', [
            'tickets' => $tickets,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status', 'priority', 'category', 'equipment', 'assignee', 'date_from', 'date_to', 'sort', 'direction']),
            'statuses' => TicketStatus::all(),
            'priorities' => TicketPriority::all(),
            'categories' => TicketCategory::all(),
            'assets' => Asset::all(['id', 'title']),
            'solvers' => User::role(['admin', 'solver'])->with('avatar')->get(['id', 'name', 'attachment_avatar']),
        ]);
    }

    /**
     * Archive a ticket
     */
    public function archive(Ticket $ticket): RedirectResponse
    {
        $this->authorize('archive', $ticket);

        $ticket->archive();

        return redirect()->back()->with('success', __('tickets.flash.archived'));
    }

    public function unarchive(Ticket $ticket): RedirectResponse
    {
        $this->authorize('unarchive', $ticket);

        $ticket->unarchive();

        return redirect()->back()->with('success', __('tickets.flash.unarchived'));
    }
}
