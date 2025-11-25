<?php

namespace App\Http\Controllers\API;

use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * GET /api/users
     * Pagination + filtres + tri
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->select('id', 'name', 'email', 'attachment_avatar')
            ->with('avatar');

        // 🔍 Filtres
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%$search%")
                    ->orWhere('email', 'like', "%$search%");
            });
        }

        if ($request->filled('language')) {
            $query->where('language', $request->language);
        }

        if ($request->filled('timezone')) {
            $query->where('timezone', $request->timezone);
        }

        $sortBy = $request->get('sort_by', 'id');
        $sortDir = $request->get('sort_dir', 'asc');

        if (!in_array($sortBy, ['id', 'name', 'email', 'created_at'])) {
            $sortBy = 'id';
        }

        if (!in_array($sortDir, ['asc', 'desc'])) {
            $sortDir = 'asc';
        }

        $query->orderBy($sortBy, $sortDir);

        $perPage = intval($request->get('per_page', 10));

        return response()->json(
            $query->paginate($perPage)
        );
    }

    /**
     * GET /api/users/{user}
     */
    public function show(User $user)
    {
        return response()->json([
            'id'       => $user->id,
            'name'     => $user->name,
            'email'    => $user->email,
            'phone'    => $user->phone,
            'language' => $user->language,
            'timezone' => $user->timezone,
            'avatar'   => $user->avatar,
        ]);
    }

    /**
     * PUT/PATCH /api/users/{user}
     * Le user peut modifier que lui-même
     */
    public function update(Request $request, User $user)
    {
        if ($request->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Forbidden: You can update only your own profile.'
            ], 403);
        }

        $data = $request->validate([
            'name'      => 'string|max:255',
            'phone'     => 'string|nullable',
            'language'  => 'string|nullable',
            'timezone'  => 'string|nullable',
        ]);

        $user->update($data);

        return response()->json([
            'message' => 'User updated',
            'user'    => $user->fresh()
        ]);
    }

    /**
     * DELETE /api/users/{user}
     */
    public function destroy(Request $request, User $user)
    {
        if ($request->user()->id !== $user->id) {
            return response()->json([
                'message' => 'Forbidden: You can delete only your own account.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully'
        ]);
    }

    /**
     * POST /api/users
     * (Réservé Admin futur) : Créer un utilisateur manuellement
     */
    public function store(Request $request)
    {
        // On pourra ajouter ici : $this->authorize('create', User::class);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        $data['password'] = bcrypt($data['password']);

        $user = User::create($data);

        return response()->json([
            'message' => 'User created successfully',
            'user' => $user
        ], 201);
    }
}
