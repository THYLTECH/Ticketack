<?php

// app/Http/Controllers/Assets.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;

// Models
use App\Models\Asset;
use App\Models\AssetAttachment;
use App\Models\AssetAttribute;

// Requests
use App\Http\Requests\Assets\Store as RequestsStore;
use App\Http\Requests\Assets\Update as RequestsUpdate;
use App\Models\Attachment;

/**
 * Class Assets
 *
 * Controller for managing assets and their related data.
 *
 * @package App\Http\Controllers
 */
class Assets extends Controller
{

    public function __construct() {
        $this->authorizeResource(Asset::class, 'asset');
    }

    /**
     * Display a listing of the assets.
     *
     * @return Response
     */
    public function index(Request $request): Response {
        $query = Asset::query();
        
        //Load parent relationship
        $query->with(['parent']);
    
        // Apply search filter if provided
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', '%' . $search . '%')
                  ->orWhere('description', 'like', '%' . $search . '%');
            });
        }
    
        // assets pagination
        $assets = $query->paginate(100)->withQueryString();
        
        // Add depth_level property to each asset
        $assets->getCollection()->each(function (\App\Models\Asset $asset) {
            $asset->depth_level = $asset->depth;
        });
    
        return Inertia::render('assets/index', [
            'assets' => $assets,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new asset.
     *
     * @return Response
     */
    public function create(): Response {
        $assets = Asset::getTreeOrderedAssets();

        $attribute_keys = AssetAttribute::query()
            ->select('key')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('key')
            ->orderByDesc('count')
            ->pluck('key');

        return Inertia::render('assets/create', ['assets' => $assets, 'attribute_keys' => $attribute_keys]);
    }

    /**
     * Show the form for editing the specified asset.
     *
     * @param Asset $asset
     * @return Response | RedirectResponse
     */
    public function edit(Asset $asset): Response | RedirectResponse {
        $assets = Asset::getTreeOrderedAssets()->filter(fn($a) => $a->id !== $asset->id)->values();

        $attribute_keys = AssetAttribute::query()
            ->select('key')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('key')
            ->orderByDesc('count')
            ->pluck('key');

        return Inertia::render('assets/edit', ['asset' => $asset->load('attachments'), 'assets' => $assets, 'attribute_keys' => $attribute_keys]);
    }

    /**
     * Display the specified asset.
     *
     * @param Asset $asset
     * @return Response | RedirectResponse
     */
    public function show(Asset $asset): Response | RedirectResponse {
        return Inertia::render('assets/show', ['asset' => $asset->load('attachments'), 'assets' => Asset::getTreeOrderedAssets()]);
    }

    /**
     * Store a newly created asset in database.
     *
     * @param Request $request
     * @return RedirectResponse
     */
    public function store(RequestsStore $request): RedirectResponse {
        $data = $request->validated();

        $asset = Asset::create([
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'icon' => $data['icon'] ?? null,
        ]);

        // Parent association
        if($data['parent_id'] ?? false) {
            $parent = Asset::find($data['parent_id']);
            if($parent) {
                $asset->parent()->associate($parent);
                $asset->save();
            }
        }

        // Attributes
        if(!empty($data['attributes'])) {
            foreach($data['attributes'] as $attribute) {
                $asset->attributes()->create([
                    'key' => $attribute['key'],
                    'value' => $attribute['value'],
                ]);
            }
        }

        // Attachments
        if(!empty($data['attachments'])) {
            foreach($data['attachments'] as $attachment) {
                $file = $attachment['file'];

                $path = Storage::disk('public')->putFile("assets/{$asset->id}/attachments", $file);

                $a = Attachment::create([
                    'file_name'      => $file->getClientOriginalName(),
                    'file_path'      => $path,
                    'mime_type'      => $file->getMimeType(),
                    'file_extension' => $file->getClientOriginalExtension(),
                    'file_size'      => $file->getSize(),
                    'title'          => $attachment['title'],
                    'description'    => $attachment['description'] ?? null,
                ]);

                $asset->attachments()->save($a);
            }
        }

        return redirect()->route('assets.index')->with(['success' => __('assets.flash.created')]);
    }

    /**
     * Update the specified asset in database.
     *
     * @param Request $request
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function update(RequestsUpdate $request, Asset $asset): RedirectResponse {
        $data = $request->validated();

        $asset->update([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'icon'        => $data['icon'] ?? null,
        ]);

        // Parent association
        if($data['parent_id'] ?? false) {
            $parent = Asset::find($data['parent_id']);
            if($parent) {


                // The parent cannot be the asset itself or one of its descendants
                if($parent->id === $asset->id || $parent->isDescendantOf($asset)) {
                    $asset->parent()->dissociate();
                    $asset->save();
                    return redirect()->route('assets.edit', ['asset' => $asset->id])->with(['error' => __('assets.flash.invalid_parent')]);
                }

                $asset->parent()->associate($parent);
                $asset->save();
            }
        } else {
            $asset->parent()->dissociate();
            $asset->save();
        }

        // Attributes
        $asset->attributes()->delete();
        if(!empty($data['attributes'])) {
            foreach($data['attributes'] as $attribute) {
                $asset->attributes()->create([
                    'key' => $attribute['key'],
                    'value' => $attribute['value'],
                ]);
            }
        }

        // Attachments
        // Delete attachments that were removed in the edit form
        $existingIds = $asset->attachments()
            ->pluck('attachments.id')
            ->map(fn($id) => (string)$id)
            ->toArray();


        $incomingIds = collect($data['attachments'])
            ->filter(fn($att) => !empty($att['id']))
            ->pluck('id')
            ->map(fn($id) => (string)$id)
            ->toArray();

        $idsToDelete = array_diff($existingIds, $incomingIds);

        if (!empty($idsToDelete)) {
            foreach ($idsToDelete as $deleteId) {
                $attachment = Attachment::find($deleteId);

                if ($attachment) {
                    if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
                        Storage::disk('public')->delete($attachment->file_path);
                    }
                    $attachment->delete();
                }
            }
        }

        // Add or update attachments
        if(!empty($data['attachments'])) {
            foreach($data['attachments'] as $attachment) {
                // New upload
                if($attachment['file'] instanceof UploadedFile) {
                    $file = $attachment['file'];

                    $path = Storage::disk('public')->putFile("assets/{$asset->id}/attachments", $file);

                    $a = Attachment::create([
                        'file_name'      => $file->getClientOriginalName(),
                        'file_path'      => $path,
                        'mime_type'      => $file->getMimeType(),
                        'file_extension' => $file->getClientOriginalExtension(),
                        'file_size'      => $file->getSize(),
                        'title'          => $attachment['title'],
                        'description'    => $attachment['description'] ?? null,
                    ]);

                    $asset->attachments()->save($a);
                } else {
                    $a = Attachment::find($attachment['id']);

                    if($a) {
                        $a->update([
                            'title'       => $attachment['title'],
                            'description' => $attachment['description'] ?? null,
                        ]);
                    }
                }
            }
        }

        return redirect()->route('assets.show', ['asset' => $asset->id])->with(['success' => __('assets.flash.updated')]);
    }

    /**
     * Remove the specified asset from database.
     *
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function destroy(Asset $asset): RedirectResponse {
        $asset->delete();
        return redirect()->route('assets.index')->with(['success' => __('assets.flash.deleted')]);
    }

    /**
     * Restore the specified asset from database.
     *
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function restore(Asset $asset): RedirectResponse {
        $asset->restore();
        return redirect()->back()->with(['success' => __('assets.flash.restored')]);    }

    /**
     * Permanently delete the specified asset from database.
     *
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function forceDelete(Asset $asset): RedirectResponse {
        foreach($asset->attachments as $attachment) {
            if ($attachment->file_path && Storage::disk('public')->exists($attachment->file_path)) {
                Storage::disk('public')->delete($attachment->file_path);
            }
            $attachment->delete();
        }

        $asset->forceDelete();
        return redirect()->route('assets.index')->with(['success' => __('assets.flash.forced_deleted')]);
    }
}
