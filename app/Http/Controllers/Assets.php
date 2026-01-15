<?php

namespace App\Http\Controllers;

use App\Http\Requests\Assets\Store as RequestsStore;
use App\Http\Requests\Assets\Update as RequestsUpdate;
use App\Models\Asset;
use App\Models\AssetAttribute;
use App\Models\Attachment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class Assets extends Controller
{
    public function __construct()
    {
        $this->authorizeResource(Asset::class, 'asset');
    }

    public function index(Request $request): Response
    {
        $query = Asset::with(['parent', 'attributes']);

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%$search%")
                    ->orWhere('description', 'like', "%$search%")
                    ->orWhereHas('attributes', function ($qAttr) use ($search) {
                        $qAttr->where('key', 'like', "%$search%")
                            ->orWhere('value', 'like', "%$search%");
                    });
            });
        }

        if ($request->filled('attributes')) {
            $attributes = explode(',', $request->input('attributes'));
            $query->whereHas('attributes', function ($q) use ($attributes) {
                $q->whereIn('key', $attributes);
            });
        }

        if ($request->filled('sort')) {
            $query->orderBy($request->input('sort'), $request->input('direction', 'asc'));
        }

        $perPage = $request->input('per_page', 25);
        $assets = $query->paginate($perPage)->withQueryString();

        if ($request->filled('search') || $request->filled('attributes')) {
            $this->ensureParentsAreLoaded($assets);
        }

        $assets->getCollection()->each(function (Asset $asset) {
            $asset->depth_level = $asset->depth ?? 0;
        });

        $availableAttributes = AssetAttribute::select('key')
            ->distinct()
            ->orderBy('key')
            ->pluck('key')
            ->map(fn($key) => ['value' => $key, 'label' => $key]);

        return Inertia::render('assets/index', [
            'assets' => $assets,
            'filters' => $request->only(['search', 'attributes']),
            'available_attributes' => $availableAttributes,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('assets/create', [
            'assets' => Asset::getTreeOrderedAssets(),
            'attribute_keys' => $this->getPopularAttributeKeys(),
        ]);
    }

    public function edit(Asset $asset): Response
    {
        $assets = Asset::getTreeOrderedAssets()
            ->filter(fn($a) => $a->id !== $asset->id)
            ->values();

        return Inertia::render('assets/edit', [
            'asset' => $asset->load('attachments', 'attributes'),
            'assets' => $assets,
            'attribute_keys' => $this->getPopularAttributeKeys(),
        ]);
    }

    public function show(Asset $asset): Response
    {
        return Inertia::render('assets/show', [
            'asset' => $asset->load('attachments', 'attributes', 'parent'),
            'assets' => Asset::getTreeOrderedAssets()
        ]);
    }

    public function store(RequestsStore $request): RedirectResponse
    {
        $data = $request->validated();

        $asset = Asset::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'icon' => $data['icon'] ?? null,
        ]);

        if (!empty($data['parent_id'])) {
            $this->associateParent($asset, $data['parent_id']);
        }

        if (!empty($data['attributes'])) {
            $this->syncAttributes($asset, $data['attributes']);
        }

        if (!empty($data['attachments'])) {
            $this->handleAttachments($asset, $data['attachments']);
        }

        return redirect()->route('assets.index')->with(['success' => __('assets.flash.created')]);
    }

    public function update(RequestsUpdate $request, Asset $asset): RedirectResponse
    {
        $data = $request->validated();

        $asset->update([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'icon' => $data['icon'] ?? null,
        ]);

        if (array_key_exists('parent_id', $data)) {
            if (!$this->associateParent($asset, $data['parent_id'])) {
                return redirect()->route('assets.edit', ['asset' => $asset->id])
                    ->with(['error' => __('assets.flash.invalid_parent')]);
            }
        }

        $this->syncAttributes($asset, $data['attributes'] ?? []);
        $this->handleAttachments($asset, $data['attachments'] ?? [], true);

        return redirect()->route('assets.show', ['asset' => $asset->id])
            ->with(['success' => __('assets.flash.updated')]);
    }

    public function destroy(Asset $asset): RedirectResponse
    {
        $asset->delete();
        return redirect()->route('assets.index')->with(['success' => __('assets.flash.deleted')]);
    }

    public function restore(Asset $asset): RedirectResponse
    {
        $this->authorize('restore', $asset);
        $asset->restore();
        return redirect()->back()->with(['success' => __('assets.flash.restored')]);
    }

    public function forceDelete(Asset $asset): RedirectResponse
    {
        $this->authorize('forceDelete', $asset);

        foreach ($asset->attachments as $attachment) {
            $this->deleteAttachmentFile($attachment);
            $attachment->delete();
        }

        $asset->forceDelete();
        return redirect()->route('assets.index')->with(['success' => __('assets.flash.forced_deleted')]);
    }

    private function getPopularAttributeKeys()
    {
        return AssetAttribute::query()
            ->select('key')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('key')
            ->orderByDesc('count')
            ->pluck('key');
    }

    private function associateParent(Asset $asset, ?string $parentId): bool
    {
        if (!$parentId) {
            $asset->parent()->dissociate();
            $asset->save();
            return true;
        }

        $parent = Asset::find($parentId);
        if ($parent) {
            if ($parent->id === $asset->id || $parent->isDescendantOf($asset)) {
                $asset->parent()->dissociate();
                $asset->save();
                return false;
            }
            $asset->parent()->associate($parent);
            $asset->save();
        }
        return true;
    }

    private function syncAttributes(Asset $asset, array $attributes): void
    {
        $asset->attributes()->delete();
        if (!empty($attributes)) {
            $asset->attributes()->createMany($attributes);
        }
    }

    private function handleAttachments(Asset $asset, array $attachmentsData, bool $isUpdate = false): void
    {
        if ($isUpdate) {
            $existingIds = $asset->attachments()->pluck('attachments.id')->map(fn($id) => (string)$id)->toArray();
            $incomingIds = collect($attachmentsData)->filter(fn($att) => !empty($att['id']))->pluck('id')->map(fn($id) => (string)$id)->toArray();
            $idsToDelete = array_diff($existingIds, $incomingIds);

            if (!empty($idsToDelete)) {
                $attachmentsToDelete = Attachment::whereIn('id', $idsToDelete)->get();
                foreach ($attachmentsToDelete as $attachment) {
                    $this->deleteAttachmentFile($attachment);
                    $attachment->delete();
                }
            }
        }

        foreach ($attachmentsData as $attachment) {
            if (isset($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
                $file = $attachment['file'];
                $path = Storage::disk('public')->putFile("assets/$asset->id/attachments", $file);

                $a = Attachment::create([
                    'file_name' => $file->getClientOriginalName(),
                    'file_path' => $path,
                    'mime_type' => $file->getMimeType(),
                    'file_extension' => $file->getClientOriginalExtension(),
                    'file_size' => $file->getSize(),
                    'title' => $attachment['title'],
                    'description' => $attachment['description'] ?? null,
                ]);

                $asset->attachments()->save($a);
            } elseif (isset($attachment['id'])) {
                $a = Attachment::find($attachment['id']);
                $a?->update([
                    'title' => $attachment['title'],
                    'description' => $attachment['description'] ?? null,
                ]);
            }
        }
    }

    private function deleteAttachmentFile(Attachment $attachment): void
    {
        if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
            Storage::disk('public')->delete($attachment->file_path);
        }
    }

    private function ensureParentsAreLoaded($assets): void
    {
        $collection = $assets->getCollection();
        $currentIds = $collection->pluck('id')->flip();

        $missingParentIds = $collection->pluck('parent_id')
            ->filter()
            ->unique()
            ->filter(fn($id) => !$currentIds->has($id))
            ->values();

        while ($missingParentIds->isNotEmpty()) {
            $parents = Asset::whereIn('id', $missingParentIds)
                ->with(['parent', 'attributes'])
                ->get();

            if ($parents->isEmpty()) break;

            $collection = $collection->merge($parents);
            $parents->each(fn($p) => $currentIds->put($p->id, true));

            $missingParentIds = $parents->pluck('parent_id')
                ->filter()
                ->unique()
                ->filter(fn($id) => !$currentIds->has($id))
                ->values();
        }

        $assets->setCollection($collection->unique('id')->values());
    }
}
