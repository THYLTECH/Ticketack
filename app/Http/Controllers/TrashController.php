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
        if ($model) {
            $model->restore();
            // Utilisation de trans_choice pour le singulier (count = 1)
            return back()->with('success', trans_choice('trash.notifications.restored', 1));
        }
        return back()->with('error', __('trash.common.unknown'));
    }

    public function forceDelete(Request $request, string $type, int $id)
    {
        $model = $this->getModelByType($type, $id);
        if ($model) {
            $model->forceDelete();
            return back()->with('success', trans_choice('trash.notifications.deleted', 1));
        }
        return back()->with('error', __('trash.common.unknown'));
    }

    public function bulkRestore(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'type' => 'required|string']);
        $modelClass = $this->getModelClass($request->type);

        $count = $modelClass::onlyTrashed()->whereIn('id', $request->ids)->restore();

        // trans_choice gère automatiquement le "s" selon $count
        return back()->with('success', trans_choice('trash.notifications.restored', $count));
    }

    public function bulkForceDelete(Request $request)
    {
        $request->validate(['ids' => 'required|array', 'type' => 'required|string']);
        $modelClass = $this->getModelClass($request->type);

        $count = $modelClass::onlyTrashed()->whereIn('id', $request->ids)->forceDelete();

        return back()->with('success', trans_choice('trash.notifications.deleted', $count));
    }

    public function emptyTrash(Request $request, string $type)
    {
        $modelClass = $this->getModelClass($type);
        $modelClass::onlyTrashed()->forceDelete();

        // Traduction simple ici avec paramètre :type
        // On utilise __() car c'est une phrase unique, pas de comptage précis
        // On traduit le type pour qu'il soit joli (users -> utilisateurs)
        $translatedType = __('trash.tabs.' . $type . 's'); // ex: trash.tabs.users

        return back()->with('success', __('trash.notifications.emptied', ['type' => $translatedType]));
    }

// Helper pour récupérer la classe (à ajouter en privé)
    /**
     * Helper pour récupérer le nom de la classe (ex: App\Models\User).
     * Utilisé pour les actions de masse (bulk) et vider la corbeille.
     */
    private function getModelClass(string $type)
    {
        return match ($type) {
            'user' => User::class,
            'role' => Role::class, // Assure-toi d'importer le bon modèle Role
            'asset' => Asset::class,
            default => abort(404, "Type d'élément inconnu"),
        };
    }

    /**
     * Helper pour récupérer une instance spécifique (ex: User avec l'ID 5).
     * Utilisé pour restaurer ou supprimer un seul élément.
     */
    private function getModelByType(string $type, int $id)
    {
        // On réutilise getModelClass pour éviter de dupliquer le match()
        $class = $this->getModelClass($type);

        // On cherche l'élément supprimé (onlyTrashed)
        return $class::onlyTrashed()->findOrFail($id);
    }
}
