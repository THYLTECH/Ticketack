<?php

// app/Http/Controllers/Assets.php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Response;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

// Models
use App\Models\Asset;
use App\Models\AssetAttachment;
use App\Models\AssetAttribute;

// Requests
use App\Http\Requests\Assets\Store as RequestsStore;
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
    /**
     * Display a listing of the assets.
     * 
     * @return Response
     */
    public function index(): Response {
        return Inertia::render('assets/index', ['assets' => Asset::all()]);
    }

    /**
     * Show the form for creating a new asset.
     * 
     * @return Response
     */
    public function create(): Response {

        $assets = Asset::getTreeOrderedAssets();
        // order the attribute_keys by usage frequency

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
        if(!$asset) return redirect()->route('assets.index')->with(['error' => __('Asset doesn\'t exist')]);
        return Inertia::render('assets/edit', ['asset' => $asset]);
    }

    /**
     * Display the specified asset.
     * 
     * @param Asset $asset
     * @return Response | RedirectResponse
     */
    public function show(Asset $asset): Response | RedirectResponse {
        if(!$asset) return redirect()->route('assets.index')->with(['error' => __('Asset doesn\'t exist')]);
        return Inertia::render('assets/show', ['asset' => $asset]);
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

        return redirect()->route('assets.index')->with(['success' => __('Asset created successfully.')]);
    }

    /**
     * Update the specified asset in database.
     * 
     * @param Request $request
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function update(Request $request, Asset $asset): RedirectResponse {
        // 
    }

    /**
     * Remove the specified asset from database.
     * 
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function destroy(Asset $asset): RedirectResponse {
        $asset->delete();
        return redirect()->route('assets.index')->with(['success' => __('Asset deleted successfully.')]);
    }

    /**
     * Restore the specified asset from database.
     * 
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function restore(Asset $asset): RedirectResponse {
        $asset->restore();
        return redirect()->route('assets.index')->with(['success' => __('Asset restored successfully.')]);
    }

    /**
     * Permanently delete the specified asset from database.
     * 
     * @param Asset $asset
     * @return RedirectResponse
     */
    public function forceDelete(Asset $asset): RedirectResponse {
        $asset->forceDelete();
        return redirect()->route('assets.index')->with(['success' => __('Asset permanently deleted successfully.')]);
    }
}
