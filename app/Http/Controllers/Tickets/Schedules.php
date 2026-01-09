<?php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Ticket;
use App\Models\TicketEntry;
use App\Models\TicketSchedule;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class Schedules extends Controller
{

    public function __construct()
    {
        $this->authorizeResource(TicketSchedule::class, 'schedule');
    }

    public function index()
    {
        $this->authorize('viewAny', TicketSchedule::class);

        $schedules = TicketSchedule::with([
            'user.avatar',
            'ticket.priority',
            'ticket.category',
            'ticket.status',
            'ticket.comments.user.avatar',
        ])->get();

        $entries = TicketEntry::with([
            'user.avatar',
            'ticket.priority',
            'ticket.category',
            'ticket.status',
        ])
            ->where('user_id', auth()->id())
            ->get()
            ->map(fn($entry) => $entry->toCalendarEvent())
            ->filter();

        return Inertia::render('tickets/planning/index', [
            'events' => $schedules->concat($entries),

            'myTickets' => Ticket::whereHas('assignees', fn ($query) => $query->where('user_id', auth()->id()))
                ->with(['priority', 'category', 'status'])
                ->whereHas('status', fn ($query) => $query->where('is_closed', false))
                ->get(),

            'solvers' => User::role(['admin', 'solver'])->with('avatar')->get()->map(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'avatar' => $user->avatar,
            ]),
        ]);
    }


    public function store(Request $request)
    {
        $data = $request->validate([
            'ticket_id' => 'required|exists:tickets,id',
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'duration_minutes' => 'required|integer|min:15',
        ]);

        $this->checkOverlap($data['user_id'], $data['start_date'], $data['duration_minutes']);

        $startDate = Carbon::parse($data['start_date']);
        $endDate = $startDate->copy()->addMinutes($data['duration_minutes']);

        TicketSchedule::create([
            'ticket_id' => $data['ticket_id'],
            'user_id' => $data['user_id'],
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duration_minutes' => $data['duration_minutes'],
        ]);

        return back()->with('success', __('schedule.flash.created'));
    }

    public function update(Request $request, TicketSchedule $schedule)
    {
        $data = $request->validate([
            'start_date' => 'required|date',
            'duration_minutes' => 'required|integer|min:15',
        ]);

        $this->checkOverlap($schedule->user_id, $data['start_date'], $data['duration_minutes'], $schedule->id);

        $startDate = Carbon::parse($data['start_date']);
        $endDate = $startDate->copy()->addMinutes($data['duration_minutes']);

        $schedule->update([
            'start_date' => $startDate,
            'end_date' => $endDate,
            'duration_minutes' => $data['duration_minutes'],
        ]);

        return back()->with('success', __('schedule.flash.updated'));
    }

    public function destroy(TicketSchedule $schedule)
    {
        $schedule->delete();

        return back()->with('success', __('schedule.flash.deleted'));
    }

    /**
     * Check if a schedule overlaps with existing schedules or entries for the same user
     *
     * @param int $userId
     * @param string $startDate
     * @param int $duration
     * @param int|null $excludeId Schedule ID to exclude from overlap check (for updates)
     * @throws ValidationException
     */
    private function checkOverlap($userId, $startDate, $duration, $excludeId = null)
    {
        $newStart = Carbon::parse($startDate);
        $newEnd = $newStart->copy()->addMinutes($duration);

        $scheduleQuery = TicketSchedule::where('user_id', $userId)
            ->where(function ($q) use ($newStart, $newEnd) {
                $q->where('start_date', '<', $newEnd)
                    ->where('end_date', '>', $newStart);
            });

        if ($excludeId) {
            $scheduleQuery->where('id', '!=', $excludeId);
        }

        if ($scheduleQuery->exists()) {
            throw ValidationException::withMessages([
                'overlap' => __('schedule.flash.overlap_error')
            ]);
        }

        $entryExists = TicketEntry::where('user_id', $userId)
            ->where(function ($q) use ($newStart, $newEnd) {
                $q->where('start_at', '<', $newEnd)
                    ->where('end_at', '>', $newStart);
            })
            ->exists();

        if ($entryExists) {
            throw ValidationException::withMessages([
                'overlap' => __('schedule.flash.overlap_error')
            ]);
        }
    }
}
