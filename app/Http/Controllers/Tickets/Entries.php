<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketEntry;
use App\Models\TicketPriority;
use App\Models\TicketSchedule;
use App\Models\TicketStatus;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Throwable;

use Illuminate\Support\Facades\Notification;

use App\Notifications\Tickets\EntryCreated as NotificationsTicketEntryCreated;
use App\Notifications\Tickets\EntryDeleted as NotificationsTicketEntryDeleted;

class Entries extends Controller
{
    private const DATE_FORMAT = 'd/m/Y';

    public function index(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        if (!$user->can('view ticket entries')) {
            abort(403, 'Unauthorized action.');
        }

        $statuses = TicketStatus::query()->select(['id', 'title', 'color'])->orderBy('sort_order')->get();
        $priorities = TicketPriority::query()->select(['id', 'title', 'color'])->orderBy('sort_order')->get();
        $categories = TicketCategory::query()->select(['id', 'title', 'color'])->orderBy('title')->get();

        $tickets = Ticket::query()
            ->select(['id', 'title', 'description', 'asset_id'])
            ->with(['asset:id,title'])
            ->whereHas('assignees', function (Builder $q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->orWhere('author_id', $user->id)
            ->orderByDesc('created_at')
            ->limit(50)
            ->get();

        $query = TicketEntry::query()
            ->with(['ticket.status', 'ticket.priority', 'ticket.category', 'user'])
            ->where('user_id', $user->id);

        $this->applyFilters($query, $request);

        $statsQuery = clone $query;
        $totalSeconds = $statsQuery->sum('duration_seconds');
        $count = $statsQuery->count();

        $minDate = $statsQuery->min('start_at');
        $maxDate = $statsQuery->max('start_at');
        $period = ($minDate && $maxDate)
            ? Carbon::parse($minDate)->format('d/m') . ' - ' . Carbon::parse($maxDate)->format(self::DATE_FORMAT)
            : '-';

        $sort = $request->input('sort', 'start_at');
        $direction = $request->input('direction', 'desc');
        $allowedSorts = ['start_at', 'duration_seconds', 'created_at', 'ticket_id'];

        if (in_array($sort, $allowedSorts)) {
            $query->orderBy($sort, $direction);
        } else {
            $query->orderByDesc('start_at');
        }

        $perPage = $request->input('per_page', 15);
        $entries = $query->paginate($perPage)->withQueryString();

        return Inertia::render('tickets/entries/index', [
            'entries' => $entries,
            'stats' => [
                'total_hours' => round($totalSeconds / 3600, 2),
                'count' => $count,
                'period' => $period
            ],
            'tickets' => $tickets,
            'statuses' => $statuses,
            'priorities' => $priorities,
            'categories' => $categories,
            'filters' => $request->only([
                'search',
                'start_date', 'end_date', 'billable',
                'ticket_status', 'ticket_priority', 'ticket_category',
                'sort', 'direction'
            ]),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'date' => 'required|date',
            'start_time' => 'nullable|date_format:H:i',
            'hours' => 'required|integer|min:0',
            'minutes' => 'required|integer|min:0|max:59',
            'description' => 'nullable|string',
            'billable' => 'boolean',
            'schedule_id' => 'nullable|exists:ticket_schedules,id',
        ]);

        $durationSeconds = ($data['hours'] * 3600) + ($data['minutes'] * 60);

        if ($durationSeconds <= 0) {
            return back()->withErrors(['duration' => __('entries.controller.store.duration_error')]);
        }

        $startAt = Carbon::parse($data['date']);

        if (!empty($data['start_time'])) {
            $startAt->setTimeFromTimeString($data['start_time']);
        } else {
            $startAt->setTimeFrom(now());
        }

        $endAt = $startAt->copy()->addSeconds($durationSeconds);

        if ($endAt->isFuture()) {
        throw ValidationException::withMessages([
            'date' => __('entries.flash.future_error')
        ]);
    }

        /** @var User $user */
        $user = $request->user();

        $entry = DB::transaction(function () use ($data, $user, $startAt, $endAt, $durationSeconds) {

            $this->ensureNoOverlap($user->id, $startAt, $endAt);

            $entry = TicketEntry::create([
                'ticket_id' => $data['ticket_id'],
                'user_id' => $user->id,
                'note' => $data['description'] ?? null,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'duration_seconds' => $durationSeconds,
                'billable' => $data['billable'] ?? false,
            ]);

            if (!empty($data['schedule_id'])) {
                TicketSchedule::where('id', $data['schedule_id'])->delete();
            }

            return $entry;
        });

        $ticket = Ticket::findOrFail($data['ticket_id']);

        if($ticket) {
            $assignees = User::whereIn(
                'id',
                $ticket->assignees()->pluck('user_id')
            )->get();

            Notification::send($assignees, new NotificationsTicketEntryCreated($ticket, $entry));
        }


        return back()->with('success', __('entries.controller.store.success'));
    }

    public function destroy(TicketEntry $entry)
    {
        if ($entry->user_id !== auth()->id()) {
            abort(403);
        }

        $ticket = Ticket::findOrFail($entry->ticket_id);

        if($ticket) {
            $assignees = User::whereIn(
                'id',
                $ticket->assignees()->pluck('user_id')
            )->get();

            Notification::send($assignees, new NotificationsTicketEntryDeleted($ticket, $entry));
        }

        $entry->delete();

        return back()->with('success', __('entries.controller.destroy.success'));
    }

    public function report(Request $request)
    {
        /** @var User $user */
        $user = $request->user();

        $query = TicketEntry::query()
            ->with(['ticket.status', 'ticket.priority', 'ticket.category', 'user'])
            ->where('user_id', $user->id);

        $this->applyFilters($query, $request);

        $entries = $query->orderByDesc('start_at')->get();

        $totalSeconds = $entries->sum('duration_seconds');
        $totalHours = round($totalSeconds / 3600, 2);

        $start = $request->input('start_date') ? Carbon::parse($request->input('start_date'))->format('d-m-Y') : null;
        $end = $request->input('end_date') ? Carbon::parse($request->input('end_date'))->format('d-m-Y') : null;

        $dateLabel = ($start && $end) ? "from_{$start}_to_$end" : "all_history_" . now()->format('d-m-Y');
        $baseFilename = "Time_Report_$dateLabel";

        if ($request->input('format') === 'pdf') {
            $period = ($start && $end)
                ? str_replace('-', '/', $start) . ' to ' . str_replace('-', '/', $end)
                : __('entries.report.period_all');

            $dailySummary = $entries->groupBy(fn($entry) => $entry->start_at->format('Y-m-d'))
                ->map(fn($dayEntries) => round($dayEntries->sum('duration_seconds') / 3600, 2));

            $weeklyEntries = $entries->groupBy(function ($entry) {
                return $entry->start_at->format('o-W');
            })->sortKeysDesc();

            $pdf = Pdf::loadView('pdf.reports.entries', [
                'entries' => $entries,
                'dailySummary' => $dailySummary,
                'weeklyEntries' => $weeklyEntries,
                'totalHours' => $totalHours,
                'period' => $period,
                'user' => $user,
                'date' => now()->format(self::DATE_FORMAT),
            ]);

            $pdf->setPaper('a4');
            return $pdf->download("$baseFilename.pdf");
        }

        $headers = [
            "Content-type" => "text/csv; charset=UTF-8",
            "Content-Disposition" => "attachment; filename=$baseFilename.csv",
            "Pragma" => "no-cache",
            "Cache-Control" => "must-revalidate, post-check=0, pre-check=0",
            "Expires" => "0"
        ];

        return response()->stream(
            fn() => $this->streamCsv($entries, $totalHours),
            200,
            $headers
        );
    }

    private function streamCsv($entries, float $totalHours): void
    {
        $file = fopen('php://output', 'w');

        fputs($file, "\xEF\xBB\xBF");

        $delimiter = ',';

        fputcsv($file, [
            __('entries.report.csv.headers.date'),
            __('entries.report.csv.headers.time'),
            __('entries.report.csv.headers.ticket_id'),
            __('entries.report.csv.headers.ticket_title'),
            __('entries.report.csv.headers.category'),
            __('entries.report.csv.headers.duration'),
            __('entries.report.csv.headers.description'),
            __('entries.report.csv.headers.billable')
        ], $delimiter);

        /** @var TicketEntry $entry */
        foreach ($entries as $entry) {
            /** @var Ticket|null $ticket */
            $ticket = $entry->ticket;
            /** @var TicketCategory|null $category */
            $category = $ticket?->category;

            fputcsv($file, [
                Carbon::parse($entry->start_at)->format(self::DATE_FORMAT),
                Carbon::parse($entry->start_at)->format('H:i'),
                $entry->ticket_id,
                $ticket ? $ticket->title : __('entries.report.csv.deleted_ticket'),
                $category ? $category->title : '-',
                round($entry->duration_seconds / 3600, 2),
                $entry->note,
                $entry->billable ? __('entries.report.csv.yes') : __('entries.report.csv.no'),
            ], $delimiter);
        }

        fputcsv($file, [], $delimiter);

        fputcsv($file, [
            '', '', '', '', __('entries.report.csv.total_hours'),
            $totalHours,
            '', ''
        ], $delimiter);

        fclose($file);
    }

    private function applyFilters(Builder $query, Request $request): void
    {
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->whereHas('ticket', function (Builder $q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('id', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('asset', function (Builder $qAsset) use ($search) {
                        $qAsset->where('title', 'like', "%$search%");
                    });
            });
        }

        if ($request->filled('start_date')) {
            $query->whereDate('start_at', '>=', $request->input('start_date'));
        }
        if ($request->filled('end_date')) {
            $query->whereDate('start_at', '<=', $request->input('end_date'));
        }

        if ($request->filled('billable') && $request->input('billable') !== 'all') {
            $query->where('billable', $request->boolean('billable'));
        }

        if ($request->filled('ticket_status') && $request->input('ticket_status') !== 'all') {
            $statusId = $request->input('ticket_status');
            $query->whereHas('ticket', function (Builder $q) use ($statusId) {
                $q->where('status_id', $statusId);
            });
        }

        if ($request->filled('ticket_priority') && $request->input('ticket_priority') !== 'all') {
            $priorityId = $request->input('ticket_priority');
            $query->whereHas('ticket', function (Builder $q) use ($priorityId) {
                $q->where('priority_id', $priorityId);
            });
        }

        if ($request->filled('ticket_category') && $request->input('ticket_category') !== 'all') {
            $categoryId = $request->input('ticket_category');
            $query->whereHas('ticket', function (Builder $q) use ($categoryId) {
                $q->where('category_id', $categoryId);
            });
        }
    }

    /**
     * Ensure no overlapping entries exist for the given user and time range.
     *
     * @param int $userId
     * @param Carbon $startAt
     * @param Carbon $endAt
     * @throws ValidationException
     */
    private function ensureNoOverlap(int $userId, Carbon $startAt, Carbon $endAt): void
    {
        $conflictingEntry = TicketEntry::where('user_id', $userId)
            ->where(function (Builder $query) use ($startAt, $endAt) {
                $query->where('start_at', '<', $endAt)
                    ->where('end_at', '>', $startAt);
            })
            ->when(null, fn($q) => $q->where('id', '!=', null))
            ->with('ticket:id,title')
            ->first();

        if ($conflictingEntry) {
            $conflictStart = $conflictingEntry->start_at->format('H:i');
            $conflictEnd = $conflictingEntry->end_at->format('H:i');

            $ticketTitle = $conflictingEntry->ticket
                ? $conflictingEntry->ticket->title
                : __('entries.ticket_deleted');

            $ticketId = $conflictingEntry->ticket_id;

            $message = __('entries.flash.overlap_details', [
                'id' => $ticketId,
                'title' => Str::limit($ticketTitle, 30),
                'start' => $conflictStart,
                'end' => $conflictEnd,
            ]);

            throw ValidationException::withMessages([
                'date' => $message
            ]);
        }
    }
}
