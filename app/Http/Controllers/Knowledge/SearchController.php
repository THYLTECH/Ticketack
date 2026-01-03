<?php

namespace App\Http\Controllers\Knowledge;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\TicketCategory;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class SearchController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('knowledge/search', [
            'users' => User::all(['id', 'name']),
            'categories' => TicketCategory::all(['id', 'title']),
            'assets' => Asset::all(['id', 'title']),
        ]);
    }
}
