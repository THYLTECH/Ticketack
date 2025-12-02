<?php

// app/Http/Controllers/Users.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;

// Models
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

// Requests
// use App\Http\Requests\Users\Store as RequestsStore;
// use App\Http\Requests\Users\Update as RequestsUpdate;

/**
 * Class Users
 * 
 * Controller for managing users and their related data.
 * 
 * @package App\Http\Controllers
 */
class Users extends Controller
{

    public function __construct() {
        $this->authorizeResource(User::class, 'user');
    }

    /**
     * Display a listing of the users.
     * 
     * @return Response
     */
    public function index(): Response {
        return Inertia::render('users/index', [
            'users' => User::with('roles')->get(),
        ]);
    }

    /**
     * Show the form for creating a new user.
     * 
     * @return Response
     */
    public function create(): Response {
        // 
    }

    /**
     * Show the form for editing the specified user.
     * 
     * @param User $user
     * @return Response | RedirectResponse
     */
    public function edit(User $user): Response | RedirectResponse {
        // 
    }
    
    /**
     * Display the specified user.
     * 
     * @param User $user
     * @return Response | RedirectResponse
    */
    public function show(User $user): Response | RedirectResponse {
        // 
    }

    /**
     * Store a newly created user in database.
     * 
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(Request $request): RedirectResponse {
        // 
    }

    /**
     * Update the specified user in database.
     * 
     * @param Request $request
     * @param User $user
     * @return RedirectResponse
     */
    public function update(Request $request, User $user): RedirectResponse {  
        // 
    }

    /**
     * Remove the specified user from database.
     * 
     * @param User $user
     * @return RedirectResponse
     */
    public function destroy(User $user): RedirectResponse {
        // 
    }
}
