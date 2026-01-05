<?php

namespace App\Http\Requests\Tickets;

use Illuminate\Foundation\Http\FormRequest;

class Store extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create tickets');
    }

    public function rules(): array
    {
        $fileMaxSize = config('filesystems.upload_max_size', 8102);

        return [
            'title'             => ['required', 'string', 'max:255'],
            'description'       => ['required', 'string', 'max:10000'],

            'is_public'         => ['boolean'],
            'is_referenced'     => ['boolean'],
            'detailed_solution' => ['nullable', 'string'],
            'status_id'         => ['nullable', 'integer', 'exists:ticket_statuses,id'],
            'assignees'         => ['nullable', 'array'],
            'assignees.*.id'    => ['required', 'integer', 'exists:users,id'],

            'priority_id'       => ['required', 'integer', 'exists:ticket_priorities,id'],
            'category_id'       => ['required', 'integer', 'exists:ticket_categories,id'],
            'asset_id'          => ['nullable', 'integer', 'exists:assets,id'],

            'attachments'       => ['nullable', 'array', 'max:10'],
            'attachments.*'     => [
                'required',
                'file',
                'max:' . $fileMaxSize,
                'mimes:jpg,jpeg,png,webp,svg,pdf',
            ],
        ];
    }
}
