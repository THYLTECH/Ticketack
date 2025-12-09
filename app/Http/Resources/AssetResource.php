<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class AssetResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'icon' => $this->icon,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'attributes' => $this->whenLoaded('attributes'),
            'attachments' => $this->whenLoaded('attachments'),
            'parent' => new AssetResource($this->whenLoaded('parent')),
            'children' => AssetResource::collection($this->whenLoaded('childrenRecursive')),
        ];
    }
}
