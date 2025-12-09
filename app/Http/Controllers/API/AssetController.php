<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\AssetResource;
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
     * List assets
     *
     * Display a listing of the assets.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        Gate::authorize('view assets');

        $assets = Asset::with(['attributes', 'attachments', 'parent'])->paginate(20);
        return AssetResource::collection($assets);    }

    /**
     * Create a new asset
     *
     * Create a new asset in storage.
     *
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
            'asset'   => new AssetResource($asset->load(['attributes', 'attachments', 'parent']))
        ], 201);
    }

    /**
     * Show an asset
     *
     * Display the specified asset.
     *
     * @param Asset $asset
     * @return AssetResource
     * GET /api/assets/{asset}
     */
    public function show(Asset $asset)
    {
        Gate::authorize('show assets');
        return new AssetResource(
            $asset->load(['attributes', 'attachments', 'parent', 'childrenRecursive'])
        );
    }

    /**
     * Update an asset
     *
     * Update the specified asset in storage.
     *
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
            $this->updateParent($asset, $data['parent_id']);
        }

        if (isset($data['attributes'])) {
            $this->updateAttributes($asset, $data['attributes']);
        }

        if (!empty($data['attachments'])) {
            $this->handleAttachments($asset, $data['attachments']);
        }

        return response()->json([
            'message' => 'Asset updated successfully',
            'asset'   => new AssetResource($asset->fresh(['attributes', 'attachments', 'parent']))
        ]);
    }

    /**
     * Delete an asset
     *
     * Remove the specified asset from storage.
     *
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
    * Helpers
    */

    private function updateParent(Asset $asset, ?int $parentId): void
    {
        if ($parentId) {
            $parent = Asset::find($parentId);
            if ($parent) {
                $asset->parent()->associate($parent);
            }
        } else {
            $asset->parent()->dissociate();
        }
        $asset->save();
    }

    private function createAttributes(Asset $asset, array $attributes): void
    {
        foreach ($attributes as $attribute) {
            $asset->attributes()->create([
                'key'   => $attribute['key'],
                'value' => $attribute['value'],
            ]);
        }
    }

    private function updateAttributes(Asset $asset, array $attributes): void
    {
        foreach ($attributes as $attribute) {
            $asset->attributes()->updateOrCreate(
                ['key'   => $attribute['key']],
                ['value' => $attribute['value']]
            );
        }
    }

    private function handleAttachments(Asset $asset, array $attachments): void
    {
        foreach ($attachments as $attachmentData) {
            if (isset($attachmentData['file']) && $attachmentData['file'] instanceof UploadedFile) {
                $this->saveAttachment($asset, $attachmentData);
            }
            elseif (!empty($attachmentData['id'])) {
                $existingAttachment = $asset->attachments()
                    ->where('attachments.id', $attachmentData['id'])
                    ->first();

                if ($existingAttachment) {
                    $existingAttachment->update([
                        'title'       => $attachmentData['title'],
                        'description' => $attachmentData['description'] ?? null,
                    ]);
                }
            }
        }
    }

    /**
     * Helper to save an attachment
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
