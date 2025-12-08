<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Gate;
use Illuminate\Http\UploadedFile;

use App\Models\Asset;
use App\Models\Attachment;

use App\Http\Requests\Assets\Store as RequestsStore;
use App\Http\Requests\Assets\Update as RequestsUpdate;

class AssetController extends Controller
{
    /**
     * @return \Illuminate\Http\JsonResponse
     * GET /api/assets
     */
    public function index()
    {
        Gate::authorize('view assets');

        $assets = Asset::getTreeOrderedAssets();
        return response()->json($assets);
    }

    /**
     * @param RequestsStore $request
     * @return \Illuminate\Http\JsonResponse
     * POST /api/assets
     */
    public function store(RequestsStore $request)
    {
        Gate::authorize('create assets');

        $data = $request->validated();

        $asset = Asset::create([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'icon'        => $data['icon'] ?? null,
        ]);

        if (!empty($data['parent_id'])) {
            $parent = Asset::find($data['parent_id']);
            if ($parent) {
                $asset->parent()->associate($parent);
                $asset->save();
            }
        }

        if (!empty($data['attributes'])) {
            foreach ($data['attributes'] as $attribute) {
                $asset->attributes()->create([
                    'key'   => $attribute['key'],
                    'value' => $attribute['value'],
                ]);
            }
        }

        if (!empty($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {
                if (isset($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
                    $this->saveAttachment($asset, $attachment);
                }
            }
        }

        return response()->json([
            'message' => 'Asset created successfully',
            'asset'   => $asset->load(['attributes', 'attachments', 'parent'])
        ], 201);
    }

    /**
     * @param Asset $asset
     * @return \Illuminate\Http\JsonResponse
     * GET /api/assets/{asset}
     */
    public function show(Asset $asset)
    {
        Gate::authorize('show assets');
        return response()->json(
            $asset->load(['attributes', 'attachments', 'parent', 'childrenRecursive'])
        );
    }

    /**
     * @param RequestsUpdate $request
     * @param Asset $asset
     * @return \Illuminate\Http\JsonResponse
     * PUT /api/assets/{asset}
     */
    public function update(RequestsUpdate $request, Asset $asset)
    {
        Gate::authorize('update assets');
        $data = $request->validated();

        $asset->update([
            'title'       => $data['title'],
            'description' => $data['description'] ?? null,
            'icon'        => $data['icon'] ?? null,
        ]);

        if (array_key_exists('parent_id', $data)) {
            if ($data['parent_id']) {
                $parent = Asset::find($data['parent_id']);
                if ($parent) {
                    $asset->parent()->associate($parent);
                }
            } else {
                $asset->parent()->dissociate();
            }
            $asset->save();
        }

        if (isset($data['attributes'])) {
            foreach ($data['attributes'] as $attribute) {
                $asset->attributes()->updateOrCreate(
                    ['key'   => $attribute['key']],
                    ['value' => $attribute['value']]
                );
            }
        }

        if (!empty($data['attachments'])) {
            foreach ($data['attachments'] as $attachment) {

                // 1. Cas Nouveau Fichier
                if (isset($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
                    $this->saveAttachment($asset, $attachment);
                }

                // 2. Cas Modification d'un existant
                elseif (!empty($attachment['id'])) {

                    // --- CORRECTION DU BUG SQL ICI ---
                    // On cherche l'attachement via la relation en précisant la table 'attachments.id'
                    // Cela évite l'erreur "ambiguous column name"
                    $existingAttachment = $asset->attachments()
                        ->where('attachments.id', $attachment['id'])
                        ->first();

                    if ($existingAttachment) {
                        $existingAttachment->update([
                            'title'       => $attachment['title'],
                            'description' => $attachment['description'] ?? null,
                        ]);
                    }
                }
            }
        }

        return response()->json([
            'message' => 'Asset updated successfully',
            'asset'   => $asset->fresh(['attributes', 'attachments', 'parent'])
        ]);
    }

    /**
     * @param Asset $asset
     * @return \Illuminate\Http\JsonResponse
     * DELETE /api/assets/{asset}
     */
    public function destroy(Asset $asset)
    {
        Gate::authorize('delete assets');
        $asset->delete();
        return response()->json(['message' => 'Asset deleted successfully']);
    }

    /**
     * Helper pour sauvegarder un attachment
     */
    private function saveAttachment(Asset $asset, array $attachmentData)
    {
        $file = $attachmentData['file'];
        $path = Storage::disk('public')->putFile("assets/{$asset->id}/attachments", $file);

        $a = Attachment::create([
            'file_name'      => $file->getClientOriginalName(),
            'file_path'      => $path,
            'mime_type'      => $file->getMimeType(),
            'file_extension' => $file->getClientOriginalExtension(),
            'file_size'      => $file->getSize(),
            'title'          => $attachmentData['title'],
            'description'    => $attachmentData['description'] ?? null,
        ]);

        $asset->attachments()->save($a);
    }
}
