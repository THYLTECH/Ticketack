<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Http\Requests\Tickets\Store as RequestsStore;
use App\Models\Asset;
use App\Models\Attachment;
use App\Models\Ticket;
use App\Models\TicketAttachment;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
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
    public function __construct()
    {
        $this->authorizeResource(Ticket::class, 'ticket');
    }

    /**
     * Display a listing of tickets with filters.
     *
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $query = $this->getBaseQuery($request);

        if (!Auth::user()->hasRole(['admin', 'solver'])) {
            $query->where(function (Builder $q) {
                $q->where('author_id', Auth::id())
                    ->orWhereHas('assignees', fn($sq) => $sq->where('user_id', Auth::id()));
            });
        }

        return Inertia::render('tickets/index', [
            'tickets' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority', 'category', 'equipment', 'assignee', 'date_from', 'date_to']),
            'statuses' => TicketStatus::orderBy('sort_order')->get(['id', 'title']),
            'priorities' => TicketPriority::orderBy('sort_order')->get(['id', 'title', 'color']),
            'categories' => TicketCategory::orderBy('sort_order')->get(['id', 'title']),
            'assets' => Asset::orderBy('title')->get(['id', 'title']),
            'solvers' => User::role(['admin', 'solver'])->get(['id', 'name']),
        ]);
    }

    /**
     * Display management view for solver/admin.
     *
     * @param Request $request
     * @return Response
     */
    public function manage(Request $request): Response
    {
        $query = $this->getBaseQuery($request);
        $user = Auth::user();

        if (!$user->hasRole('admin')) {
            $query->whereHas('assignees', fn($q) => $q->where('user_id', $user->id));
        }

        return Inertia::render('tickets/manage', [
            'tickets' => $query->paginate(10)->withQueryString(),
            'filters' => $request->only(['search', 'status', 'priority', 'category', 'equipment', 'assignee', 'date_from', 'date_to']),
            'statuses' => TicketStatus::orderBy('sort_order')->get(['id', 'title', 'color']),
            'priorities' => TicketPriority::orderBy('sort_order')->get(['id', 'title', 'color']),
            'categories' => TicketCategory::orderBy('sort_order')->get(['id', 'title']),
            'assets' => Asset::orderBy('title')->get(['id', 'title']),
            'solvers' => User::role(['admin', 'solver'])->get(['id', 'name']),
        ]);
    }

    /**
     * Show creation form.
     *
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('tickets/create', [
            'priorities' => TicketPriority::orderBy('sort_order')->get(),
            'categories' => TicketCategory::orderBy('sort_order')->get(),
            'statuses' => TicketStatus::orderBy('sort_order')->get(),
            'assets' => Asset::getTreeOrderedAssets(),
            'users' => User::with('roles')->get(),
        ]);
    }

    /**
     * Display a detailed ticket view.
     *
     * @param Ticket $ticket
     * @return Response
     */
    public function show(Ticket $ticket): Response
    {
        $ticket->load([
            'user', 'priority', 'status', 'category', 'asset',
            'assignees.user', 'comments.user', 'comments.attachments',
            'logs.user', 'schedules.user', 'attachments',
        ]);

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'events' => TicketSchedule::with(['user', 'ticket.priority', 'ticket.status', 'ticket.category'])->get(),
            'solvers' => User::role(['admin', 'solver'])->get(['id', 'name', 'email']),
        ]);
    }

    /**
     * Store a newly created ticket.
     *
     * @param RequestsStore $request
     * @return RedirectResponse
     * @throws Throwable
     */
    public function store(RequestsStore $request): RedirectResponse
    {
        return DB::transaction(function () use ($request) {
            $data = $request->validated();

            $ticket = Ticket::create([
                'title' => $data['title'],
                'description' => $data['description'],
                'author_id' => $request->user()->id,
                'is_public' => $data['is_public'] ?? false,
                'is_referenced' => $data['is_referenced'] ?? false,
                'detailed_solution' => $data['detailed_solution'] ?? null,
                'priority_id' => $data['priority_id'],
                'category_id' => $data['category_id'],
                'status_id' => $data['status_id'] ?? null,
                'asset_id' => $data['asset_id'] ?? null,
            ]);

            if (!empty($data['assignees'])) {
                foreach ($data['assignees'] as $assignee) {
                    $ticket->assignees()->create(['user_id' => $assignee['id']]);
                }
            }

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
                    $path = Storage::disk('public')->putFile("tickets/$ticket->id/attachments", $file);
                    $originalName = $file->getClientOriginalName();

                    $attachment = Attachment::create([
                        'title' => $originalName,
                        'description' => null,
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
            }

            return redirect()->route('tickets.manage')->with('success', __('tickets.flash.created'));
        });
    }

    /**
     * Show edit form.
     *
     * @param Ticket $ticket
     * @return Response
     */
    public function edit(Ticket $ticket): Response
    {
        $ticket->load(['assignees.user', 'attachments']);

        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'priorities' => TicketPriority::orderBy('sort_order')->get(),
            'categories' => TicketCategory::orderBy('sort_order')->get(),
            'statuses' => TicketStatus::orderBy('sort_order')->get(),
            'assets' => Asset::getTreeOrderedAssets(),
            'users' => User::with('roles')->get(),
        ]);
    }

    /**
     * Update existing ticket.
     *
     * @param Request $request
     * @param Ticket $ticket
     * @return RedirectResponse
     * @throws Throwable
     */
    public function update(Request $request, Ticket $ticket): RedirectResponse
    {
        $fileMaxSize = config('filesystems.upload_max_size', "8192");

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'is_public' => 'boolean',
            'is_referenced' => 'boolean',
            'detailed_solution' => 'nullable|string',
            'priority_id' => 'required|exists:ticket_priorities,id',
            'category_id' => 'required|exists:ticket_categories,id',
            'status_id' => 'nullable|exists:ticket_statuses,id',
            'asset_id' => 'nullable|exists:assets,id',
            'assignees' => 'nullable|array',
            'assignees.*.id' => 'required|exists:users,id',
            'attachments' => ['nullable', 'array', 'max:10'],
            'attachments.*' => [
                'required',
                'file',
                'max:' . $fileMaxSize,
                'mimes:jpg,jpeg,png,webp,svg,pdf',
            ],
        ]);

        $newFilesCount = count($request->file('attachments') ?? []);
        $existingFilesCount = $ticket->attachments()->count();

        if (($newFilesCount + $existingFilesCount) > 10) {
            return back()->withErrors([__('tickets.controller.update.attachments_limit')]);
        }

        return DB::transaction(function () use ($data, $ticket, $request) {
            $ticket->update($data);

            if (isset($data['assignees'])) {
                $newIds = collect($data['assignees'])->pluck('id')->toArray();
                $ticket->assignees()->whereNotIn('user_id', $newIds)->get()->each->delete();

                foreach ($newIds as $userId) {
                    $ticket->assignees()->updateOrCreate(['user_id' => $userId]);
                }
            }

            if ($request->hasFile('attachments')) {
                foreach ($request->file('attachments') as $file) {
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
            }

            return redirect()->route('tickets.show', $ticket)->with('success', __('tickets.flash.updated'));
        });
    }

    /**
     * Remove the specified ticket from storage.
     *
     * @param Ticket $ticket
     * @return RedirectResponse
     */
    public function destroy(Ticket $ticket): RedirectResponse
    {
        $ticket->delete();
        return redirect()->route('tickets.manage')->with('success', __('tickets.flash.deleted'));
    }

    /**
     * Build the base query for index and manage.
     *
     * @param Request $request
     * @return Builder
     */
    private function getBaseQuery(Request $request): Builder
    {
        $query = Ticket::query()->with(['status', 'priority', 'category', 'asset', 'user', 'assignees.user']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function (Builder $q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('id', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%");
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

    /**
     * Restore a soft-deleted ticket.
     *
     * @param Ticket $ticket
     * @return RedirectResponse
     */
    public function restore(Ticket $ticket): RedirectResponse
    {
        $ticket->restore();
        return redirect()->back()->with('success', __('Ticket restored successfully.'));
    }

    /**
     * Permanently delete a ticket.
     *
     * @param Ticket $ticket
     * @return RedirectResponse
     */
    public function forceDelete(Ticket $ticket): RedirectResponse
    {
        $ticket->forceDelete();
        return redirect()->route('tickets.manage')->with('success', __('Ticket permanently deleted.'));
    }
}
