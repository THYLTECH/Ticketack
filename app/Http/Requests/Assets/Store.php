<?php

namespace App\Http\Requests\Assets;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class Store extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create assets');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        $fileMaxSize = config('filesystems.upload_max_size', 8192);

        return [
            'title'         => ['required', 'string', 'max:255'],
            'parent_id'     => ['nullable', 'exists:assets,id'],
            'description'   => ['nullable', 'string'],
            'icon'          => ['nullable', 'string', 'max:255'],

            'attributes'    => ['nullable', 'array'],
            'attributes.*.key'   => ['required_with:attributes', 'string', 'max:255', 'distinct'],
            'attributes.*.value' => ['required_with:attributes', 'string', 'max:255'],

            'attachments' => ['nullable', 'array', 'max:10'],
            'attachments.*.title' => ['required', 'string', 'max:255'],
            'attachments.*.description' => ['nullable', 'string'],
            'attachments.*.file' => ['required', 'file', 'max:' . $fileMaxSize, 'mimes:jpg,jpeg,png,webp,svg,pdf'],
        ];
    }
}
