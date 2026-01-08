<?php

// app/Http/Controllers/Tickets/Categories.php

namespace App\Http\Controllers\Tickets;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

// Models
use App\Models\TicketCategory;

// Requests
use App\Http\Requests\Tickets\Categories\Save as RequestsSave;


/**
 * Ticket Categories operations controller.
 * 
 * Handles creation, reading, updating, and deletion of ticket categories.
 * 
 * @package App\Http\Controllers\Tickets
 */
class Categories extends Controller
{
    public function __construct() {
        // $this->authorizeResource(Ticket::class, 'ticket');
    }

    public function save(RequestsSave $request)
    {
        $data = $request->validated();
        $submittedIds = collect($data['categories'])->pluck('id')->filter()->toArray();
        $existingIds = TicketCategory::pluck('id')->toArray();
        $idsToDelete = array_diff($existingIds, $submittedIds);

        if (!empty($idsToDelete)) {
            $attachedCategories = TicketCategory::whereIn('id', $idsToDelete)
                ->whereHas('tickets')
                ->pluck('title')
                ->toArray();

            if (!empty($attachedCategories)) {
                return redirect()->back()->withErrors([
                    'categories' => __('tickets.flash.categories_error', [
                        'categories' => implode(', ', $attachedCategories),
                    ]),
                ]);
            }

            TicketCategory::whereIn('id', $idsToDelete)->delete();
        }

        DB::transaction(function () use ($data) {
            $categoriesMap = [];

            foreach ($data['categories'] as $index => $categoryData) {
                $attributesToSave = [
                    'title' => $categoryData['title'],
                    'description' => $categoryData['description'],
                    'color' => $categoryData['color'],
                    'icon' => $categoryData['icon'],
                    'sort_order' => 9999 + $index,
                ];

                $category = TicketCategory::updateOrCreate(
                    ['id' => $categoryData['id'] ?? null],
                    $attributesToSave
                );
                
                // Stocker l'ID réel et le nouvel index désiré
                $categoriesMap[$category->id] = $index;
            }

            foreach ($categoriesMap as $id => $newSortOrder) {
                TicketCategory::where('id', $id)->update(['sort_order' => $newSortOrder]);
            }
        });

        return redirect()->back()->with('success', __('tickets.flash.categories_success'));
    }
}
