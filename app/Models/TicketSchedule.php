<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;

class TicketSchedule extends Model
{
    use HasFactory;
    public const DATE_FORMAT = 'd/m H:i';

    /**
     * @var array<int, string>
     */
    protected $fillable = [
        'ticket_id',
        'user_id',
        'start_date',
        'end_date',
        'duration_minutes',
    ];

    /**
     * @return BelongsTo
     */
    public function ticket(): BelongsTo
    {
        return $this->belongsTo(Ticket::class);
    }

    /**
     * @return BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return void
     */
    protected static function booted(): void
    {
        static::created(function (TicketSchedule $schedule) {
            $user = User::find($schedule->user_id)?->name ?? 'Unknown';
            $start = Carbon::parse($schedule->start_date)->format(self::DATE_FORMAT);

            $schedule->ticket->logs()->create([
                'user_id' => Auth::id(),
                'action' => 'scheduled',
                'field' => 'planning',
                'new_value' => "Assigned to $user for $start ($schedule->duration_minutes min)",
            ]);
        });

        static::updated(function (TicketSchedule $schedule) {
            if ($schedule->isDirty('user_id')) {
                $oldUser = User::find($schedule->getOriginal('user_id'))?->name ?? 'None';
                $newUser = User::find($schedule->user_id)?->name ?? 'None';

                $schedule->ticket->logs()->create([
                    'user_id' => Auth::id(),
                    'action' => 'schedule_updated',
                    'field' => 'assignee',
                    'old_value' => "Was assigned to $oldUser",
                    'new_value' => "Now assigned to $newUser",
                ]);
            }

            if ($schedule->isDirty(['start_date', 'duration_minutes'])) {
                $oldStart = Carbon::parse($schedule->getOriginal('start_date'))->format(self::DATE_FORMAT);
                $newStart = Carbon::parse($schedule->start_date)->format(self::DATE_FORMAT);

                $schedule->ticket->logs()->create([
                    'user_id' => Auth::id(),
                    'action' => 'schedule_updated',
                    'field' => 'planning',
                    'old_value' => "Was set for $oldStart",
                    'new_value' => "Moved to $newStart",
                ]);
            }
        });
    }
}
