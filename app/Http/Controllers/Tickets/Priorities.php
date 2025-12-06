<?php

// app/Http/Controllers/Tickets/Priorities.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Ticket;
use App\Models\TicketPriority;

// Requests
use App\Http\Requests\Tickets\Priorities\Save as RequestsSave;
use App\Http\Requests\Tickets\Priorities\Store as RequestsStore;
use App\Http\Requests\Tickets\Priorities\Update as RequestsUpdate;

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

    public function save(RequestsSave $request) {
        $data = $request->validated();

        // Sort order 
        foreach ($data['priorities'] as $index => $priorityData) {
            $priority = TicketPriority::find($priorityData['id']);
            if ($priority) {
                $priorityData['sort_order'] = $index;
                $priority->update($priorityData);
            }
        }

        dd(TicketPriority::all());

        // return
    }

    public function store(RequestsStore $request) {
        $data = $request->validated();

        $data['sort_order'] = TicketPriority::max('sort_order') + 1;

        TicketPriority::create($data);

        return redirect()->back()->with(['success' => 'Priority created successfully.']);
    }

    public function update(RequestsUpdate $request, TicketPriority $priority) {
        $data = $request->validated();

        $priority->update($data);

        // return
    }

    public function destroy(TicketPriority $priority) {
        $priority->delete();

        // return
    }
}
