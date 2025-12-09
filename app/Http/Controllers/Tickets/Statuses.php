<?php

// app/Http/Controllers/Tickets/Statuses.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;


// Requests
use App\Http\Requests\Tickets\Statuses\Save as RequestsSave;

// Models
use App\Models\TicketStatus;

/**
 * Ticket Statuses operations controller.
 * 
 * Handles creation, reading, updating, and deletion of ticket statuses.
 * 
 * @package App\Http\Controllers\Tickets
 */
class Statuses extends Controller
{
    public function __construct() {
        // $this->authorizeResource(Ticket::class, 'ticket');
    }

    public function save(RequestsSave $request)
    {
        $data = $request->validated();
        $submittedIds = collect($data['statuses'])->pluck('id')->filter()->toArray();
        $existingIds = TicketStatus::pluck('id')->toArray();
        $idsToChange = array_diff($existingIds, $submittedIds);

        // require only one default status and one closed status
        $defaultCount = collect($data['statuses'])->where('is_default', true)->count();
        $closedCount = collect($data['statuses'])->where('is_closed', true)->count();

        if ($defaultCount !== 1) {
            return redirect()->back()->withErrors([
                'statuses' => __('There must be exactly one default status.'),
            ]);
        }

        if ($closedCount !== 1) {
            return redirect()->back()->withErrors([
                'statuses' => __('There must be exactly one closed status.'),
            ]);
        }

    
        DB::transaction(function () use ($data, $idsToChange) {
            $statusesMap = [];

            foreach ($data['statuses'] as $index => $statusData) {
                $attributesToSave = [
                    'title' => $statusData['title'],
                    'description' => $statusData['description'],
                    'color' => $statusData['color'],
                    'is_default' => $statusData['is_default'] ?? false,
                    'is_closed' => $statusData['is_closed'] ?? false,
                    'sort_order' => 9999 + $index,
                ];

                $status = TicketStatus::updateOrCreate(
                    ['id' => $statusData['id'] ?? null],
                    $attributesToSave
                );
                
                // Stocker l'ID réel et le nouvel index désiré
                $statusesMap[$status->id] = $index;
            }

            // Delete statuses that were removed and assign tickets to default status
            if (!empty($idsToChange)) {
                $defaultStatus = TicketStatus::where('is_default', true)->first();
                TicketStatus::whereIn('id', $idsToChange)->each(function ($status) use ($defaultStatus) {
                    $status->tickets()->update(['status_id' => $defaultStatus->id]);
                    $status->delete();
                });
            }

            foreach ($statusesMap as $id => $newSortOrder) {
                TicketStatus::where('id', $id)->update(['sort_order' => $newSortOrder]);
            }
        });

        return redirect()->back()->with('success', __('Ticket statuses saved successfully.'));
    }
}
