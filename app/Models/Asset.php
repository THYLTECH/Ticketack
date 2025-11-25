<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Asset extends Model
{
    /** @use HasFactory<\Database\Factories\AssetFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'parent_id',
        'title',
        'description',
        'icon',
    ];

    protected $with = ['attributes'];

    protected function casts(): array
    {
        return [
            'parent_id' => 'integer',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'deleted_at' => 'datetime',
        ];
    }

    /**
     * Get the asset's depth (level in the hierarchy).
     */
    protected function depth(): Attribute
    {
        return Attribute::make(
            get: fn (): int => $this->parent_id ? $this->parent->depth + 1 : 0,
        );
    }

    /**
     * Relations
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(Asset::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Asset::class, 'parent_id');
    }

    /**
     * Get all children recursively.
     */
    public function childrenRecursive(): HasMany
    {
        return $this->children()->with('childrenRecursive');
    }

    public function attributes(): HasMany
    {
        return $this->hasMany(AssetAttribute::class);
    }

    public function attachments(): BelongsToMany
    {
        return $this->belongsToMany(Attachment::class, 'asset_attachments')
                    ->using(AssetAttachment::class)
                    ->withTimestamps();
    }

    /**
     * Retrieves all root assets and recursively loads their children, 
     * returning a flat collection ordered by tree traversal (pre-order).
     *
     * @return \Illuminate\Support\Collection<int, static>
     */
    public static function getTreeOrderedAssets()
    {
        $rootAssets = static::query()
            ->whereNull('parent_id')
            ->with('childrenRecursive')
            ->get();

        $orderedList = collect();

        $traverse = function ($assets, $depth = 0) use (&$traverse, &$orderedList) {
            foreach ($assets as $asset) {
                $asset->depth_level = $depth; 
                
                $orderedList->push($asset);
                
                $traverse($asset->childrenRecursive, $depth + 1);
            }
        };

        $traverse($rootAssets);
        
        return $orderedList;
    }
}