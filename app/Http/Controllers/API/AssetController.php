<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
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
     * Retourne la liste hiérarchique des assets.
     */
    public function index()
    {
        $assets = Asset::getTreeOrderedAssets();
        return response()->json($assets);
    }

    /**
     * @param RequestsStore $request
     * @return \Illuminate\Http\JsonResponse
     * POST /api/assets
     * Crée un nouvel asset.
     */
    public function store(RequestsStore $request)
    {
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
     * Retourne les détails d'un asset spécifique.
     */
    public function show(Asset $asset)
    {
        return response()->json(
            $asset->load(['attributes', 'attachments', 'parent', 'childrenRecursive'])
        );
    }

    /**
     * @param RequestsUpdate $request
     * @param Asset $asset
     * @return \Illuminate\Http\JsonResponse
     * PUT /api/assets/{asset}
     * Met à jour un asset existant.
     */
    public function update(RequestsUpdate $request, Asset $asset)
    {
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
                if (isset($attachment['file']) && $attachment['file'] instanceof UploadedFile) {
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
                elseif (!empty($attachment['id'])) {
                    $a = Attachment::find($attachment['id']);
                    if ($a && $asset->attachments()->where('attachments.id', $a->id)->exists()) {
                        $a->update([
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
     * Supprime un asset.
     */
    public function destroy(Asset $asset)
    {
        $asset->delete();
        return response()->json(['message' => 'Asset deleted successfully']);
    }
}
