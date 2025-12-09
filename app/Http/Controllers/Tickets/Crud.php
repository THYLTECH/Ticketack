<?php

// app/Http/Controllers/Tickets/Crud.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Ticket;
use App\Models\TicketCategory;
use App\Models\TicketPriority;
use App\Models\TicketStatus;

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
        $tickets = Ticket::withoutTrashed()->get();
        
        return Inertia::render('tickets/index', [
            'tickets' => $tickets,
        ]);
    }
    
    public function create() {
        $priorities = TicketPriority::orderBy('sort_order')->get();
        $categories = TicketCategory::orderBy('sort_order')->get();
        $statuses = TicketStatus::orderBy('sort_order')->get();
        $assets = Asset::getTreeOrderedAssets();
        
        return Inertia::render('tickets/create', [
            'priorities' => $priorities,
            'categories' => $categories,
            'statuses' => $statuses,
            'assets' => $assets,
        ]);
    }

    public function show(Ticket $ticket) {
        // 
    }

    public function store(Request $request) {
        // 
    }

    public function edit(Ticket $ticket) {
        // 
    }

    public function update(Request $request, Ticket $ticket) {
        // 
    }

    public function destroy(Ticket $ticket) {
        // 
    }

    public function restore(Ticket $ticket) {
        // 
    }

    public function forceDelete(Ticket $ticket) {
        // 
    }
}
