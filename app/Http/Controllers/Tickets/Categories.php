<?php

// app/Http/Controllers/Tickets/Categories.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Ticket;

/**
 * Ticket Categories operations controller.
 * 
 * Handles creation, reading, updating, and deletion of ticket categories.
 * 
 * @package App\Http\Controllers\Tickets
 */
class Categories extends Controller
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
