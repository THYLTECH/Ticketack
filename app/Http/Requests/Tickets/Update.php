<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class Update extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update tickets');
    }

    public function rules(): array
    {
        $fileMaxSize = config('filesystems.upload_max_size', 8192);

        return [
            'title'             => ['required', 'string', 'max:255'],
            'description'       => ['required', 'string', 'max:10000'],

            'is_public'         => ['boolean'],
            'is_referenced'     => ['boolean'],
            'detailed_solution' => ['nullable', 'string'],
            'status_id'         => ['nullable', 'integer', 'exists:ticket_statuses,id'],

            'priority_id'       => ['required', 'integer', 'exists:ticket_priorities,id'],
            'category_id'       => ['required', 'integer', 'exists:ticket_categories,id'],
            'asset_id'          => ['nullable', 'integer', 'exists:assets,id'],

            'assignees'         => ['nullable', function ($attribute, $value, $fail) {
                if (is_string($value) && ($value === '[]' || $value === '')) {
                    return;
                }
                if (!is_array($value)) {
                    $fail('Le champ assignees doit être un tableau.');
                }
            }],
            'assignees.*.id'    => ['required', 'integer', 'exists:users,id'],

            'attachments'       => ['nullable', 'array', 'max:10'],
            'attachments.*'     => [
                'nullable',
                function ($attribute, $value, $fail) use ($fileMaxSize) {
                    if ($value instanceof \Illuminate\Http\UploadedFile) {
                        $extension = $value->getClientOriginalExtension();
                        if (!in_array(strtolower($extension), ['jpg', 'jpeg', 'png', 'webp', 'svg', 'pdf'])) {
                            $fail("Le type de fichier n'est pas autorisé.");
                        }
                        if ($value->getSize() / 1024 > $fileMaxSize) {
                            $fail("Le fichier est trop volumineux.");
                        }
                    }
                }
            ],
        ];
    }
}
