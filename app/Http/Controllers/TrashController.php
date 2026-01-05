<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Role;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class TrashController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('view trash');

        $search = $request->input('search');

        return Inertia::render('trash/index', [
            'deletedTickets' => Ticket::onlyTrashed()
                ->when($search, fn(Builder $query, $search) => $query->where(function (Builder $q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('id', 'like', '%' . $search . '%');
                }))
                ->with(['user.avatar', 'status', 'priority', 'category', 'asset', 'assignees.user.avatar'])
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'tickets_page')
                ->withQueryString(),

            'deletedUsers' => User::onlyTrashed()
                ->when($search, fn(Builder $query, $search) => $query->where(function (Builder $q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('email', 'like', '%' . $search . '%');
                }))
                ->with(['avatar', 'roles'])
                ->withCount('tickets')
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'users_page')
                ->withQueryString(),

            'deletedRoles' => Role::onlyTrashed()
                ->when($search, fn(Builder $query, $search) => $query->where('name', 'like', '%' . $search . '%'))
                ->withCount(['permissions', 'users'])
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'roles_page')
                ->withQueryString(),

            'deletedAssets' => Asset::onlyTrashed()
                ->when($search, fn(Builder $query, $search) => $query->where(function (Builder $q) use ($search) {
                    $q->where('title', 'like', '%' . $search . '%')
                        ->orWhere('serial_number', 'like', '%' . $search . '%');
                }))
                ->withCount('tickets')
                ->orderByDesc('deleted_at')
                ->paginate(5, ['*'], 'assets_page')
                ->withQueryString(),

            'filters' => $request->only(['search']),
        ]);
    }

    public function restore(string $type, int $id): RedirectResponse
    {
        Gate::authorize('restore items');

        /** @var Model|SoftDeletes $model */
        $model = $this->getModelByType($type, $id);
        $model->restore();

        return back()->with('success', trans_choice('trash.notifications.restored', 1));
    }

    public function forceDelete(string $type, int $id): RedirectResponse
    {
        Gate::authorize('force delete items');

        /** @var Model|SoftDeletes $model */
        $model = $this->getModelByType($type, $id);
        $model->forceDelete();

        return back()->with('success', trans_choice('trash.notifications.deleted', 1));
    }

    public function bulkRestore(Request $request): RedirectResponse
    {
        Gate::authorize('restore trash');

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'type' => 'required|string|in:ticket,user,role,asset',
        ]);

        $modelClass = $this->getModelClass($request->type);

        /** @var Builder $query */
        $query = (new $modelClass)->onlyTrashed();

        $count = $query->whereIn('id', $request->ids)->restore();

        return back()->with('success', trans_choice('trash.notifications.restored', $count));
    }

    public function bulkForceDelete(Request $request): RedirectResponse
    {
        Gate::authorize('force delete trash');

        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer',
            'type' => 'required|string|in:ticket,user,role,asset',
        ]);

        $modelClass = $this->getModelClass($request->type);

        /** @var Builder $query */
        $query = (new $modelClass)->onlyTrashed();

        $items = $query->whereIn('id', $request->ids)->get();
        $count = 0;

        foreach ($items as $item) {
            /** @var Model|SoftDeletes $item */
            if ($item->forceDelete()) {
                $count++;
            }
        }

        return back()->with('success', trans_choice('trash.notifications.deleted', $count));
    }

    private function getModelClass(string $type): string
    {
        return match ($type) {
            'ticket' => Ticket::class,
            'user' => User::class,
            'role' => Role::class,
            'asset' => Asset::class,
            default => throw new NotFoundHttpException(),
        };
    }

    private function getModelByType(string $type, int $id): Model
    {
        $class = $this->getModelClass($type);

        /** @var Builder $query */
        $query = (new $class)->onlyTrashed();

        return $query->findOrFail($id);
    }
}
