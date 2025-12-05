<?php

// app/Http/Controllers/Tickets/Crud.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

// Models
use App\Models\Ticket;

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
        return Inertia::render('tickets/index', ['tickets' => Ticket::withoutTrashed()->get()]);
    }

    public function create() {
        return Inertia::render('tickets/create');
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
