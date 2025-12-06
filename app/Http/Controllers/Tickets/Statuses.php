<?php

// app/Http/Controllers/Tickets/Statuses.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Ticket;

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

    public function save(Request $request) {
        // 
    }

    public function store(Request $request) {
        // 
    }

    public function update(Request $request, Ticket $ticket) {
        // 
    }

    public function destroy(Ticket $ticket) {
        // 
    }
}
