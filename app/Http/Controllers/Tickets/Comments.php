<?php

// app/Http/Controllers/Tickets/Comments.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

// Models
use App\Models\Ticket;

// Requests
use App\Http\Requests\Tickets\Comments\Store as RequestStore;

class Comments extends Controller
{
    public function store(RequestStore $request, Ticket $ticket) {
        $data = $request->validated();

        $ticket->comments()->create([
            'user_id' => $request->user()->id,
            'content' => $data['content'],
        ]);

        return redirect()->back()->with(['success' => 'Comment added successfully.']);
    }
}
