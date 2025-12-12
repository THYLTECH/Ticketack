<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\Asset;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TrashController extends Controller
{
    /**
     * Show the trash page with search and pagination.
     */
    public function index(Request $request)
    {
        $search = $request->input('search');

        return Inertia::render('trash/index', [

            'deletedUsers' => User::onlyTrashed()
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
                })
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'users_page')
                ->withQueryString(),

            'deletedRoles' => Role::onlyTrashed()
                ->when($search, function ($query, $search) {
                    $query->where('name', 'like', "%{$search}%");
                })
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'roles_page')
                ->withQueryString(),

            'deletedAssets' => Asset::onlyTrashed()
                ->when($search, function ($query, $search) {
                    $query->where('title', 'like', "%{$search}%");
                })
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'assets_page')
                ->withQueryString(),

            'filters' => $request->only(['search']),
        ]);
    }

    public function restore(Request $request, string $type, int $id)
    {
        $model = $this->getModelByType($type, $id);
        $model->restore();

        return back()->with('success', trans_choice('trash.notifications.restored', 1));
    }

    public function forceDelete(Request $request, string $type, int $id)
    {
        $model = $this->getModelByType($type, $id);
        $model->forceDelete();

        return back()->with('success', trans_choice('trash.notifications.deleted', 1));
    }

    public function bulkRestore(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'type' => 'required|string']);
        $modelClass = $this->getModelClass($request->type);

        $count = $modelClass::onlyTrashed()->whereIn('id', $request->ids)->restore();

        return back()->with('success', trans_choice('trash.notifications.restored', $count));
    }

    public function bulkForceDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'type' => 'required|string']);
        $modelClass = $this->getModelClass($request->type);

        $count = $modelClass::onlyTrashed()->whereIn('id', $request->ids)->forceDelete();

        return back()->with('success', trans_choice('trash.notifications.deleted', $count));
    }

    private function getModelClass(string $type)
    {
        return match ($type) {
            'user' => User::class,
            'role' => Role::class,
            'asset' => Asset::class,
            default => abort(404, "Type d'élément inconnu"),
        };
    }

    private function getModelByType(string $type, int $id)
    {
        $class = $this->getModelClass($type);

        return $class::onlyTrashed()->findOrFail($id);
    }
}
