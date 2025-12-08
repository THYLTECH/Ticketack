<?php

// app/Http/Controllers/Tickets/Priorities.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\TicketPriority;

// Requests
use App\Http\Requests\Tickets\Priorities\Save as RequestsSave;

/**
 * Ticket Priorities operations controller.
 * 
 * Handles creation, reading, updating, and deletion of ticket priorities.
 * 
 * @package App\Http\Controllers\Tickets
 */
class Priorities extends Controller
{
    public function __construct() {
        // $this->authorizeResource(Ticket::class, 'ticket');
    }

    public function save(RequestsSave $request)
    {
        $data = $request->validated();
        $submittedIds = collect($data['priorities'])->pluck('id')->filter()->toArray();
        $existingIds = TicketPriority::pluck('id')->toArray();
        $idsToDelete = array_diff($existingIds, $submittedIds);

        if (!empty($idsToDelete)) {
            $attachedPriorities = TicketPriority::whereIn('id', $idsToDelete)
                ->whereHas('tickets')
                ->pluck('title')
                ->toArray();

            if (!empty($attachedPriorities)) {
                return redirect()->back()->withErrors([
                    'priorities' => __('Some priorities cannot be deleted because they are attached to existing tickets: :priorities', [
                        'priorities' => implode(', ', $attachedPriorities),
                    ]),
                ]);
            }

            TicketPriority::whereIn('id', $idsToDelete)->delete();
        }

        DB::transaction(function () use ($data) {
            $prioritiesMap = [];

            foreach ($data['priorities'] as $index => $priorityData) {
                $attributesToSave = [
                    'title' => $priorityData['title'],
                    'description' => $priorityData['description'],
                    'color' => $priorityData['color'],
                    'sort_order' => 9999 + $index,
                ];

                $priority = TicketPriority::updateOrCreate(
                    ['id' => $priorityData['id'] ?? null],
                    $attributesToSave
                );
                
                // Stocker l'ID réel et le nouvel index désiré
                $prioritiesMap[$priority->id] = $index;
            }

            foreach ($prioritiesMap as $id => $newSortOrder) {
                TicketPriority::where('id', $id)->update(['sort_order' => $newSortOrder]);
            }
        });

        return redirect()->back()->with('success', __('Ticket priorities saved successfully.'));
    }
}
