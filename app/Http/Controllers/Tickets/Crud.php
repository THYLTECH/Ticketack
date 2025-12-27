<?php

// app/Http/Controllers/Tickets/Crud.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\TicketSchedule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;

// Models
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;
use App\Models\User;
use App\Models\Attachment;
use App\Models\TicketAssignee;
use App\Models\TicketAttachment;

/**
 * Ticket CRUD operations controller.
 *
 * Handles creation, reading, updating, and deletion of tickets.
 *
 * @package App\Http\Controllers\Tickets
 */
class Crud extends Controller
{
    public function __construct() {
        $this->authorizeResource(Ticket::class, 'ticket');
    }

    public function index() {
        $tickets = Ticket::whereHas('assignees', function($query) {
            $query->where('user_id', Auth::user()->id);
        })->get();

        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }

    public function manage() {
        $tickets = Ticket::withoutTrashed()->get();

        return Inertia::render('tickets/manage', [
            'tickets' => $tickets,
        ]);

    }

    public function create() {
        $priorities = TicketPriority::orderBy('sort_order')->get();
        $categories = TicketCategory::orderBy('sort_order')->get();
        $statuses = TicketStatus::orderBy('sort_order')->get();
        $assets = Asset::getTreeOrderedAssets();

        // $users = User::hasPermission([''])->with('roles')->get();
        $users = User::with('roles')->get();

        return Inertia::render('tickets/create', [
            'priorities' => $priorities,
            'categories' => $categories,
            'statuses' => $statuses,
            'assets' => $assets,

            'users' => $users,
        ]);
    }

    public function show(Ticket $ticket) {
        $ticket->load([
            'user',
            'priority',
            'status',
            'category',
            'asset',
            'assignees.user',
            'comments.user',
            'logs.user',
            'schedules.user',
            'attachments',
        ]);

        $events = TicketSchedule::with([
            'user',
            'ticket.priority',
            'ticket.status'
        ])->get();

        $solvers = User::role(['admin', 'solver'])->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'profile_photo_url' => $user->profile_photo_url ?? $user->avatar_url,
            ];
        });

        return Inertia::render('tickets/show', [
            'ticket' => $ticket,
            'events' => $events,
            'solvers' => $solvers,
        ]);
    }
    public function store(RequestsStore $request) {
        $data = $request->validated();

        // Create the ticket
        $ticket = Ticket::create([
            'title' => $data['title'],
            'description' => $data['description'],
            'author_id' => $request->user()->id,

            'priority_id' => $data['priority_id'],
            'category_id' => $data['category_id'],
            'status_id' => $data['status_id'],
            'asset_id' => $data['asset_id'],
        ]);

        if (isset($data['assignees'])) {
            $assigneesToSave = [];
            foreach ($data['assignees'] as $assignee) {
                $assigneesToSave[] = new TicketAssignee(['user_id' => $assignee['id']]);
            }
            $ticket->assignees()->saveMany($assigneesToSave);
        }

        // Attachments
        if(!empty($data['attachments'])) {
            foreach($data['attachments'] as $attachment) {
                $file = $attachment['file'];

                $path = Storage::disk('public')->putFile("tickets/{$ticket->id}/attachments", $file);

                $a = Attachment::create([
                    'file_name'      => $file->getClientOriginalName(),
                    'file_path'      => $path,
                    'mime_type'      => $file->getMimeType(),
                    'file_extension' => $file->getClientOriginalExtension(),
                    'file_size'      => $file->getSize(),
                    'title'          => $attachment['title'],
                    'description'    => $attachment['description'] ?? null,
                ]);

                $attachment = $a;
                $ticketId = $ticket->id;
                $attachmentId = $attachment->id;

                TicketAttachment::create([
                    'ticket_id' => $ticketId,
                    'attachment_id' => $attachmentId,
                ]);
            }
        }

        $ticket->save();

        return redirect()->route('tickets.manage')->with(['success' => __('tickets.flash.created')]);
    }

    public function edit(Ticket $ticket) {
        $priorities = TicketPriority::orderBy('sort_order')->get();
        $categories = TicketCategory::orderBy('sort_order')->get();
        $statuses = TicketStatus::orderBy('sort_order')->get();
        $assets = Asset::getTreeOrderedAssets();
        $users = User::with('roles')->get();

        $ticket->load(['assignees.user', 'attachments']);

        return Inertia::render('tickets/edit', [
            'ticket' => $ticket,
            'priorities' => $priorities,
            'categories' => $categories,
            'statuses' => $statuses,
            'assets' => $assets,
            'users' => $users,
        ]);
    }

    public function update(Request $request, Ticket $ticket) {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'priority_id' => 'required|exists:ticket_priorities,id',
            'category_id' => 'required|exists:ticket_categories,id',
            'status_id' => 'required|exists:ticket_statuses,id',
            'asset_id' => 'required|exists:assets,id',
            'assignees' => 'nullable|array',
            'assignees.*.id' => 'required|exists:users,id',
        ]);

        $ticket->update([
            'title' => $data['title'],
            'description' => $data['description'],
            'priority_id' => $data['priority_id'],
            'category_id' => $data['category_id'],
            'status_id' => $data['status_id'],
            'asset_id' => $data['asset_id'],
        ]);

        if (isset($data['assignees'])) {
            $ticket->assignees()->delete();

            $assigneeIds = array_map(fn($assignee) => $assignee['id'], $data['assignees']);
            $assigneesToSave = [];
            foreach ($assigneeIds as $userId) {
                $assigneesToSave[] = new TicketAssignee([
                    'user_id' => $userId,
                ]);
            }
            $ticket->assignees()->saveMany($assigneesToSave);
        }

        return redirect()->route('tickets.show', $ticket)->with('success', __('Ticket updated successfully.'));
    }

    public function destroy(Ticket $ticket) {
        $ticket->delete();
        return redirect()->route('tickets.manage')->with('success', __('Ticket deleted successfully.'));
    }

    public function restore(Ticket $ticket) {
        $ticket->restore();
        return redirect()->back()->with('success', __('Ticket restored successfully.'));
    }

    public function forceDelete(Ticket $ticket) {
        $ticket->forceDelete();
        return redirect()->route('tickets.manage')->with('success', __('Ticket permanently deleted.'));
    }
}
